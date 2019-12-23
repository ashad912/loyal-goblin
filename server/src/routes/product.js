import express from "express";
import { Product } from "../models/product";
import { auth } from "../middleware/auth";
import isEqual from "lodash/isEqual";
import {
  asyncForEach,
  updatePerks,
  designateUserPerks
} from "../utils/methods";
import { Rally } from "../models/rally";
import { User } from "../models/user";
import { Party } from "../models/party";
import {Item} from '../models/item'
import { ArchiveOrder } from "../models/archiveOrder";

const router = new express.Router();

////ADMIN-SIDE

//OK
router.post("/create", auth, async (req, res) => {
  const product = new Product(req.body);

  try {
    await product.save();
    res.status(201).send(product);
  } catch (e) {
    res.status(500).send(e);
  }
});

//OK
router.patch("/update", auth, async (req, res, next) => {
  let updates = Object.keys(req.body);
  const id = req.body._id;

  updates = updates.filter(update => {
    return update !== "_id";
  });

  const forbiddenUpdates = [""];

  const isValidOperation = updates.every(update => {
    return !forbiddenUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid update!" });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).send();
    }

    updates.forEach(update => {
      product[update] = req.body[update]; //rally[update] -> rally.name, rally.password itd.
    });

    await product.save();

    res.send(product);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//OK
router.delete("/remove", auth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.body._id });

    if (!product) {
      res.status(404).send();
    }
    res.send();
  } catch (e) {
    res.status(500).send(e.message);
  }
});

////USER-SIDE

const calculateOrder = async user => {
  try {
    const party = await Party.findById(user.party);

    let partyId = null;
    let leader = null;
    let membersIds = [];

    if (party) {
      partyId = party._id;
      membersIds = [...party.members];
      leader = party.leader;
    } else {
      leader = user._id;
    }

    if (!user) {
      throw Error("Nie znaleziono użytkownika!");
    }
    if (partyId && !user.party) {
      throw Error("Użytkownik nie należy do żadnej drużyny!");
    }

    const members = await verifyParty(leader, membersIds, user.activeOrder);

    await user
      .populate({
        path: "activeOrder.products.product",
        populate: { path: "awards.itemModel", select: "name imgSrc" }
      })
      .execPopulate();
     
    const partyFullObject = [user, ...members];

    const calculatedOrders = {};

    await asyncForEach(partyFullObject, async partyMember => {
      //HERE IMPLEMENT PRICE AND EXPERIENCE MODS - input: activeOrder, userPerks; output: object for view

      const currentMember = user.activeOrder.findIndex(
        basket => basket.profile._id.toString() === partyMember._id.toString()
      );

      let modelPerks = await designateUserPerks(partyMember);
      user.activeOrder[currentMember].products.forEach(p => {
        const product = p.product;

        const productId = product._id.toString();

        if (modelPerks.products[productId].hasOwnProperty("experienceMod")) {
          product.experience =
            product.price * 10 + modelPerks.products[productId].experienceMod;
        } else {
          product.experience = product.price * 10;
        }
        if (modelPerks.products[productId].hasOwnProperty("priceMod")) {
          product.price += modelPerks.products[productId].priceMod;
          if (product.price < 0) {
            product.price = 0.0;
          }
        }
      });
      //currentMember.products.forEach(product => console.log(product.product.price, product.product.experience))
      if (user.activeOrder[currentMember].products.length > 0) {
        let totalPrice = 0
         let totalExperience = 0
        let totalAwards = []
        user.activeOrder[currentMember].products.forEach(product => {
           totalPrice += product.product.price * product.quantity

           totalExperience += product.product.experience * product.quantity

           totalAwards = totalAwards.concat(product.product.awards)
           
        })
        console.log(totalPrice, totalExperience, totalAwards)

        user.activeOrder[currentMember].price = totalPrice;
        user.activeOrder[currentMember].experience = totalExperience;
        user.activeOrder[currentMember].awards = totalAwards;
      }
      //calculatedOrders[partyMember._id.toString()] = {_id: partyMember._id.toString(), totalPrice: currentMember.totalPrice, totalExperience: currentMember.totalExperience, totalAwards: currentMember.totalAwards }
      // user.activeOrder.find(basket => )
    });


  } catch (e) {
    throw Error(e, "Błąd przy obliczaniu zamówienia");
  }
};

//OK
router.get("/shop", auth, async (req, res) => {
  const user = req.user
  try {
    const shop = await Product.find({}).populate({
      path: "awards.itemModel"
    });

    await updatePerks(user, false);

    if (user.activeOrder.length) {
      await user
        .populate({
          path: "activeOrder.profile",
          select: "_id name avatar bag equipped userPerks"
        })
        .populate({
                  path: "activeOrder.awards.itemModel", select: "name imgSrc"
                })
        .execPopulate();

    }

    if(user.party){

      await user
        .populate({
          path: "party",
          populate: {
            path: "members",
            select: "bag equipped name _id avatar bag equipped userPerks",
            populate: { path: "bag", populate: { path: "itemModel" } }
          }
        })
        .execPopulate();
    }
    if(user.party && !user.party.inShop){
      user.party.inShop = true
      await user.party.save()
    }

    res.send({
      shop,
      party: user.party,
      activeOrder: user.activeOrder
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.patch("/leave", auth, async (req, res) => {
  const user = req.user
  if(user.party){
    await user.populate({path: "party"}).execPopulate()
    user.party.inShop = false
    await user.party.save()
  }
  res.sendStatus(200)
})

const verifyParty = (leader, membersIds, order) => {
  return new Promise(async (resolve, reject) => {
    try {
      const members = await User.find({
        $and: [
          { _id: { $in: membersIds } },
          { activeOrder: { $size: 0 } } //checking active order - party
        ]
      });

      if (members.length !== membersIds.length) {
        throw new Error(
          "Not every member found OR member has another active order!"
        );
      }

      // MORE COMPLEX WAY
      // await asyncForEach(membersIds, async (memberId) => {
      //     const member = await User.findById(memberId)
      //     if(!member){
      //         throw new Error(`Member ${member} does not exist!`)
      //     }

      //     if(member.activeOrder.length){
      //         throw new Error(`Another active order exists (user: ${memberId})!`)
      //     }
      // })

      //checking if order profiles match party

      const party = [
        leader.toString(),
        ...membersIds.map(member => member.toString())
      ];
      let orderParty = [];
      await asyncForEach(order, async user => {
        const memberId = user.profile._id;

        orderParty = [...orderParty, memberId.toString()];
      });
      if (!isEqual(orderParty, party)) {
        throw Error("Invalid party!");
      }

      resolve(members);
    } catch (e) {
      reject(e);
    }
  });
};

//OK
router.patch("/activate", auth, async (req, res) => {
  const order = req.body.order;
  const user = req.user;

  try {
    //checking active order - user
    //TODO: should override last order?
    if (user.activeOrder.length > 0) {
      throw new Error(`Another active order exists (user: ${user._id})!`);
    }

    let membersIds = [];
    let leader = null;

    if (user.party) {
      const party = await Party.findById(user.party);
      membersIds = [...party.members];
      leader = party.leader;
    } else {
      leader = user._id;
    }

    if (leader && leader.toString() !== user._id.toString()) {
      //here are objectIDs - need to be string
      throw new Error("User is not the leader!");
    }
    //const party = await verifyParty(leader, membersIds, order);

    user.activeOrder = order;

    await user
      .populate({
        //populate after verification
        path: "activeOrder.profile",
        select: "_id name avatar"
      })
      .populate({
        path: "activeOrder.products.product",
        populate: { path: "awards.itemModel" } //is necessary here?
      })
      .execPopulate();

    await calculateOrder(user);
    await user.save();

    await user.populate({
      path: "activeOrder.awards.itemModel", select: "name imgSrc"
    })
    .execPopulate();

    //WORKING! AS COMMENT FOR TESTS
    /*
        setTimeout(async () => {
            user.activeOrder = []
            await user.save()
        }, 60*1000); //removing activeOrder after 60 seconds
        */

    res.send(user.activeOrder);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.patch("/cancel", auth, async (req, res) => {
  const user = req.user
  if (user.activeOrder.length <= 0) {
    throw new Error(`No active order exists (user: ${user._id})!`);
  }
  try {
    const orderArchived = await ArchiveOrder.findById(user.activeOrder._id)
    if(orderArchived){
      throw new Error(`Order ${user.activeOrder._id} was already verified!`);
    }

    user.activeOrder = []
    await user.save()
    res.sendStatus(200)

  } catch (error) {
    res.status(400).send(e.message);
  }

})

//triggered by ADMIN
//OK BUT TO DEVELOP
router.patch("/verify", auth, async (req, res) => {
  try {
    const user = await User.findOne({
      $and: [
        { _id: req.body._id },
        //{party: partyId},
        { activeOrder: { $not: { $size: 0 } } } //size does not accept ranges
      ]
    });
    await calculateOrder(user);
    await user.save()
    await user.populate({
      path: "activeOrder.awards.itemModel", select: "name imgSrc"
    }).populate({path: 'activeOrder.profile', select: 'equipped'})
    .execPopulate();



    asyncForEach(user.activeOrder, async order => {
      if(order.products.length && order.profile.equipped.scroll){
        await Item.findOneAndDelete({_id: order.profile.equipped.scroll})
      }
    })

    //1 add leader filed 
    //2 calc totalPrice
    //3 set each user data

    //TODO: create ArchiveOrder - save modified experience for users OR repeat function in 'finalize'

    res.send(user.activeOrder);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//DEVELOP
//ADMIN?
router.post("/finalize", auth, async (req, res) => {
  //depends on source of request
  const party = req.party;
  const user = req.user; //if admin-side: get leader of this party

  try {
    //const order = await ArchiveOrder.findById(req.body.order)
    const activeRally = await Rally.findOne({
      $and: [
        { startDate: { $lte: moment() } },
        { expiryDate: { $gte: moment() } }
      ]
    });

    if (
      party.name !== user.party.name ||
      party.leader.toString() !== user.party.leader.toString() ||
      isEqual(party.members, user.party.members)
    ) {
      throw new Error("Party mismatch!");
    }

    const partyIds = [...user.party.members, party.leader];

    await asyncForEach(partyIds, async memberId => {
      const member = await User.findById(memberId);
      member.bag = [...member.bag /*, things from order*/];
      member.experience = member.experience; /*+ exp from order for user*/
      await member.save();

      if (
        activeRally &&
        !activeRally.users.includes(
          memberId.toString() /*!!! toString() - to CHECK! */
        )
      ) {
        activeRally.users = [...activeRally.users, memberId];
        await activeRally.save();
      }
    });

    res.send();
  } catch (e) {
    res.status(500).send(e.message);
  }
});

export const productRouter = router;
