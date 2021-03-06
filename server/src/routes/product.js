import express from "express";
import { pick } from "lodash";
import moment from "moment";

import keys from '@config/keys'

import { Product } from "@models/product";
import { Rally } from "@models/rally";
import { User } from "@models/user";
import { OrderExpiredEvent } from "@models/orderExpiredEvent";
import { Item } from "@models/item";
import { ArchiveOrder } from "@models/archiveOrder";
import { MissionInstance } from '@models/missionInstance'

import { barmanAuth } from "@middleware/barmanAuth";
import { adminAuth } from "@middleware/adminAuth";
import { auth } from "@middleware/auth";

import { ERROR, WARN, INFO } from '@utils/constants'
import {
  asyncForEach,
  removeImage,
  savePNGImage,
  getEndpointError
} from "@utils/functions";

import productStore from '@store/product.store.js'
import { recaptcha } from "../middleware/recaptcha";

const router = new express.Router();



////ADMIN-SIDE

router.get("/products", adminAuth, async (req, res, next) => {
  const onlyNames = req.query.onlyNames === "true";
  try {
    if (onlyNames) {
      const products = await Product.find({}, { _id: 1, name: 1 });
      return res.status(200).send(products);
    }

    const products = await Product.find({}).populate({
      path: "awards.itemModel",
      populate: { path: "perks.target.disc-product", select: "_id name imgSrc" }
    });
    res.status(200).send(products);
  } catch (e) {
    next(e)
  }
});

//OK
router.post("/create", adminAuth, async (req, res, next) => {
  const product = new Product(req.body);

  try {
    await product.save();
    res.status(201).send(product._id);
  } catch (e) {
    next(e)
  }
});

//OK
router.patch("/update", adminAuth, async (req, res, next) => {
  let updates = Object.keys(req.body);
  const id = req.body._id;

  try {
    updates = updates.filter(update => {
      return update !== "_id" || update !== "imgSrc";
    });

    const forbiddenUpdates = [""];

    const isValidOperation = updates.every(update => {
      return !forbiddenUpdates.includes(update);
    });

    if (!isValidOperation) {
      throw getEndpointError(WARN, 'Invalid update')
    }


    const product = await Product.findById(id);

    if (!product) {
      throw getEndpointError(WARN, 'Product does not exist', null, 404)
    }

    updates.forEach(update => {
      product[update] = req.body[update]; //rally[update] -> rally.name, rally.password itd.
    });

    if (req.files) {
      let icon = req.files.icon.data;
      const imgSrc = await savePNGImage(
        icon,
        product._id,
        productStore.uploadPath,
        product.imgSrc
      );
      product.imgSrc = imgSrc;
    }

    await product.save();

    res.send(product._id);
  } catch (e) {
    next(e)
  }
});

router.patch("/uploadImage/:id", adminAuth, async (req, res, next) => {
  try {
    if (!req.files) {
      throw getEndpointError(WARN, 'No file(s) provided')
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      throw getEndpointError(WARN, 'Product does not exist', null, 404)
    }

    const date = Date.now();

    if (req.files.icon) {
      let icon = req.files.icon.data;
      const imgSrc = await savePNGImage(
        icon,
        product._id,
        productStore.uploadPath,
        product.imgSrc,
        date
      );
      product.imgSrc = imgSrc;
    }

    await product.save();

    res.status(200).send();
  } catch (e) {
    next(e)
  }
});

//OK
router.delete("/remove", adminAuth, async (req, res, next) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.body._id });

    if (!product) {
      throw getEndpointError(WARN, 'Product does not exist', null, 404)
    }
    await removeImage(productStore.uploadPath, product.imgSrc);
    res.send();
  } catch (e) {
    next(e)
  }
});

router.get("/orders", adminAuth, async (req, res, next) => {
  const page = parseInt(req.query.page);
  const rowsPerPage = parseInt(req.query.rowsPerPage);
  const nameFilter = req.query.name || "";
  const fromDate = req.query.from
    ? moment(req.query.from).toISOString()
    : moment()
      .subtract(1, "days")
      .toISOString();
  const toDate = req.query.to
    ? moment(req.query.to).toISOString()
    : moment().toISOString();

  try {
    const users = await User.find(
      { name: new RegExp(nameFilter, "gi") },
      { _id: 1 }
    );
    const usersIds = users.map(user => user._id);

    const orders = await ArchiveOrder.aggregate()
      .match({
        $and: [
          { leader: { $in: usersIds } },
          {
            createdAt: {
              $gte: new Date(fromDate),
              $lt: new Date(toDate)
            }
          }
        ]
      })
      .sort({ createdAt: -1 })
      .skip(rowsPerPage * page)
      .limit(rowsPerPage)
      .project({
        leader: 1,
        totalPrice: 1,
        createdAt: 1
      });

    await User.populate(orders, {
      path: "leader",
      select: "_id name"
    });

    const countedRecords = await ArchiveOrder.find(
      {
        $and: [
          { leader: { $in: usersIds } },
          {
            createdAt: {
              $gte: new Date(fromDate),
              $lt: new Date(toDate)
            }
          }
        ]
      },
      { _id: 1 }
    ).countDocuments();

    res.send({ orders, countedRecords });
  } catch (e) {
    next(e)
  }
});

////USER-SIDE


//OK
router.get("/shop", auth, async (req, res, next) => {
  const user = req.user;
  const socketConnectionStatus = req.query.socketConnectionStatus === "true"

  try {

    if (user.party) {
      const party = await user.validatePartyAndLeader()
      if (req.query.socketConnectionStatus !== undefined) {
        if (party && party.members.length && !socketConnectionStatus) { //if client of multiplayer shopping is not connected to socket
          throw getEndpointError(WARN, `Leader not connected to party members`, user._id)
        }
      }
    }

    const shop = await Product.find({}).populate({
      path: "awards.itemModel",
      populate: { path: "perks.target.disc-product", select: "_id name" }
    });

    await MissionInstance.removeIfExists(user._id)

    const userPerks = await user.updatePerks(true);


    // If user left shop before 5 min countdown and returned after countdown but before orderExpiredEvent removed user.activeOrder - clear order 
    if (user.activeOrder.length && moment.utc().valueOf() >= moment.utc(user.activeOrder[0].createdAt).add(productStore.orderValidTimeInMins, productStore.timeUnit).valueOf()) {
      await user.clearActiveOrder()
    }


    if (user.activeOrder.length) {
      await user.orderPopulate()
    }

    if (user.party) {
      await user
        .partyPopulate()
        .execPopulate();

      for (let i = 0; i < user.party.members.length; i++) {
        user.party.members[i].equipped = pick(user.party.members[i].equipped, 'scroll')
        user.party.members[i].bag = user.party.members[i].bag.filter(item => {
          return item.itemModel.type === 'scroll'
        })
      }

      user.party.leader.equipped = pick(user.party.leader.equipped, 'scroll')
      user.party.leader.bag = user.party.leader.bag.filter(item => {
        return item.itemModel.type === 'scroll'
      })
    }
    if (user.party && !user.party.inShop) {
      user.party.inShop = true;
      // Can be saved like this -> user.party is now Mongo model due to population and no use toObject method
      await user.party.save();

      //ALTERNATIVE OPTION:
      //await Party.updateOne({_id: user.party._id}, {$set: {inShop: true}})
    }

    res.send({
      shop,
      party: user.party,
      activeOrder: user.activeOrder,
      userPerks
    });
  } catch (e) {
    next(e)
  }
});

router.get('/activeOrder', auth, async (req, res, next) => {
  try {
    const user = req.user
    if (user.activeOrder && user.activeOrder.length > 0) {
      return res.send(true)
    } else {
      return res.send(false)
    }
  } catch (e) {
    next(e)
  }
})

router.patch("/leave", auth, async (req, res, next) => {
  const user = req.user;
  try {
    if (user.party) {
      const party = await user.validatePartyAndLeader()

      party.inShop = false;

      //ALTERNATIVE:
      //await user.populate({ path: "party" }).execPopulate();
      //await user.party.save();

      await party.save()
      res.send(party._id);
    } else {
      res.sendStatus(200);
    }
  } catch (e) {
    next(e)
  }
});





//OK
router.patch("/activate", auth, recaptcha, async (req, res, next) => {
  const order = req.body.order;
  const user = req.user;

  try {
    //checking active order - user
    //TODO: should override last order?
    if (user.activeOrder.length > 0) {
      throw getEndpointError(WARN, `Another active order exists`, user._id)
    }

    let membersIds = [];
    let leader = null;

    if (user.party) {

      const party = await user.validatePartyAndLeader(true)

      membersIds = [...party.members];
      leader = party.leader;
    } else {
      leader = user._id;
    }

    // if (leader && leader.toString() !== user._id.toString()) {
    //   //here are objectIDs - need to be string
    //   throw new Error("User is not the leader!");
    // }
    //const party = await verifyParty(leader, membersIds, order); <- here is JS 
    const momentDate = moment
      .utc(new Date())
      .add(productStore.orderValidTimeInMins, productStore.timeUnit)
      .toDate();

    order[0].createdAt = momentDate;
    user.activeOrder = order;

    await user.calculateOrder();
    await user.orderPopulate()
    await user.save();

    if (keys.replica) {
      // Just for sure - if order expired event from previous order still exists in db
      const previousOrderEvent = await OrderExpiredEvent.findById(user._id)

      if (previousOrderEvent) {
        await previousOrderEvent.remove()
      }

      // Create new expired event
      await OrderExpiredEvent.create({ _id: user._id })
    }

    //LEGACY NOREPLICA: prevents removing valid order - TIMER IS NOT CLEANED
    if (!keys.replica) {
      setTimeout(async () => {
        try {
          const result = await User.updateOne(
            { _id: user._id, 'activeOrder': { $elemMatch: { createdAt: user.activeOrder[0].createdAt } } },
            { $set: { activeOrder: [] } }
          )
          // console.log(result)
        } catch (e) {
          console.log(e.message)
        }


      }, 5 * 60 * 1000 + 1000); //removing activeOrder after 5 minutes (+1 second)
    }

    res.send(user.activeOrder);
  } catch (e) {
    next(e)
  }
});

router.patch("/cancel", auth, async (req, res, next) => {
  const user = req.user;
  try {

    if (user.party) {
      await user.validatePartyAndLeader()
    }

    if (user.activeOrder.length <= 0) {
      throw getEndpointError(WARN, `No active order exists`, user._id)
    }
    const orderArchived = await ArchiveOrder.findById(user.activeOrder._id);
    if (orderArchived) {
      throw getEndpointError(WARN, `Order ${user.activeOrder._id} was already verified!`, user._id)
    }

    await user.clearActiveOrder()

    res.sendStatus(200);
  } catch (e) {
    next(e)
  }
});

//OK
router.get("/verify/:id", barmanAuth, async (req, res, next) => {
  try {
    const user = await User.findOne({
      $and: [
        { _id: req.params.id },
        //{party: partyId},
        { activeOrder: { $not: { $size: 0 } } } //size does not accept ranges
      ]
    });

    if (!user) {
      throw getEndpointError(WARN, `No active order found`, req.params.id)
    }

    if (user.party) {
      await user.validatePartyAndLeader()
    }

    await user.calculateOrder();
    await user.orderPopulate()


    res.status(200).send(user.activeOrder);
  } catch (e) {
    next(e)
  }
});

router.post("/finalize", barmanAuth, async (req, res, next) => {


  try {
    const user = await User.findOne({
      $and: [
        { _id: req.body.userId },
        { activeOrder: { $not: { $size: 0 } } } //size does not accept ranges
      ]
    });

    if (!user) {
      throw getEndpointError(WARN, `User has canceled the order`, req.body.userId)
    }

    const frontEndOrder = req.body.currentOrder



    if (user.activeOrder.length <= 0) {
      throw getEndpointError(WARN, `No active order`, user._id)
    }

    user.activeOrder.forEach((basket, index) => {
      if ((basket._id.toString() !== frontEndOrder[index]._id) || basket.price !== frontEndOrder[index].price) {
        throw getEndpointError(WARN, `No. ${index + 1} basket is invalid`, user._id)
      }
    })

    const orderPartyIds = user.activeOrder.map(basket => basket.profile.toString())

    if (!user.party) {
      if (orderPartyIds.length > 1) {
        throw getEndpointError(WARN, `Multiple baskets for user`, user._id)
      }

    } else {

      const party = await user.validatePartyAndLeader()
      party.members = [party.leader, ...party.members]

      if (party.leader.toString() !== orderPartyIds[0]) {
        throw getEndpointError(WARN, `Leader verification error`, user._id)
      }
      party.members.forEach((member, index) => {
        if (member.toString() !== orderPartyIds[index]) {
          throw getEndpointError(WARN, `Basket no. ${index + 1} does not match to member - ${member.toString()}`, user._id)
        }
      })
      await user.populate({ path: 'party' }).execPopulate()
    }


    const activeRally = await Rally.findOne({
      $and: [
        { startDate: { $lte: moment() } },
        { expiryDate: { $gte: moment() } }
      ]
    });

    const archive = { leader: req.body.userId, totalPrice: 0, users: [] }

    await asyncForEach(user.activeOrder, async basket => {

      const member = await User.findById(basket.profile)

      const exp = basket.experience;
      const items = [];
      let newShopAwards = []
      if (member.shopNotifications.awards && member.shopNotifications.awards.length) {
        newShopAwards = [...member.shopNotifications.awards]
      }
      await asyncForEach(basket.awards, async item => {

        const index = newShopAwards.findIndex((award) => award.itemModel.toString() === item.itemModel.toString())
        if (index > -1) {
          newShopAwards[index].quantity += item.quantity
        } else {
          newShopAwards = [...newShopAwards, { quantity: item.quantity, itemModel: item.itemModel }]
        }

        for (let i = 0; i < item.quantity; i++) {
          const newAward = await Item({ itemModel: item.itemModel, owner: member._id })
          await newAward.save()
          items.push(newAward._id)
        }
      })


      const newLevels = member.getNewLevels(exp);

      const isNewFlag = exp > 0 || newShopAwards.length ? true : false

      const scroll = basket.products.length > 0 && member.equipped.scroll ? await Item.findById(member.equipped.scroll) : null

      if (scroll) {
        await scroll.remove()
      }

      const updatedUserPerks = scroll ? await user.updatePerks(true, true) : member.userPerks




      await User.updateOne(
        { _id: member._id },
        {
          $addToSet: { bag: { $each: items } },
          $inc: { experience: exp, levelNotifications: newLevels, 'shopNotifications.experience': exp },
          $set: { 'userPerks': updatedUserPerks, 'shopNotifications.isNew': isNewFlag, 'shopNotifications.awards': newShopAwards, 'activeOrder': [] },
        }
      );

      if (keys.replica) {
        const orderExpiredEvent = await OrderExpiredEvent.findById(user._id)

        if (orderExpiredEvent) {
          await orderExpiredEvent.remove()
        }
      }


      if (activeRally) {
        const userIndex = activeRally.users.findIndex((user) => user.profile.toString() === member._id.toString())

        if (userIndex > -1) {
          activeRally.users[userIndex].experience += exp
        } else {
          activeRally.users = [...activeRally.users, { profile: member._id, experience: exp }];
        }
        await activeRally.save();

      }


      archive.totalPrice += basket.price
      archive.users.push(basket)
    });


    const newArchiveOrder = new ArchiveOrder(archive)
    await newArchiveOrder.save()

    res.send();
  } catch (e) {
    next(e)
  }
});



export const productRouter = router;
