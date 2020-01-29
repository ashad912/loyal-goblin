import express from "express";
import { Product } from "../models/product";
import { adminAuth } from "../middleware/adminAuth";
import { auth } from "../middleware/auth";
import isEqual from "lodash/isEqual";
import moment from "moment";
import {
  asyncForEach,
  updatePerks,
  designateUserPerks,
  removeImage,
  saveImage,
  verifyCaptcha,
  designateNewLevels
} from "../utils/methods";
import { Rally } from "../models/rally";
import { User } from "../models/user";
import { MissionInstance } from "../models/missionInstance";
import { Party } from "../models/party";
import { Item } from "../models/item";
import { ArchiveOrder } from "../models/archiveOrder";
import { barmanAuth } from "../middleware/barmanAuth";

const uploadPath = "../static/images/products/";

const router = new express.Router();

////ADMIN-SIDE

router.get("/products", adminAuth, async (req, res) => {
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
    console.log(e.message);
    res.status(500).send(e.message);
  }
});

//OK
router.post("/create", adminAuth, async (req, res) => {
  const product = new Product(req.body);

  // let icon = req.files.icon.data
  // const imgSrc = await saveImage(icon, product._id, uploadPath, null)
  // product.imgSrc = imgSrc

  try {
    await product.save();
    res.status(201).send(product._id);
  } catch (e) {
    res.status(500).send(e);
  }
});

//OK
router.patch("/update", adminAuth, async (req, res, next) => {
  let updates = Object.keys(req.body);
  const id = req.body._id;

  updates = updates.filter(update => {
    return update !== "_id" || update !== "imgSrc";
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

    if (req.files) {
      let icon = req.files.icon.data;
      const imgSrc = await saveImage(
        icon,
        product._id,
        uploadPath,
        product.imgSrc
      );
      product.imgSrc = imgSrc;
    }

    await product.save();

    res.send(product._id);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.patch("/uploadImage/:id", adminAuth, async (req, res) => {
  try {
    if (!req.files) {
      throw new Error("Brak ikony produktu");
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new Error("Product does not exist!");
    }

    const date = Date.now();

    if (req.files.icon) {
      let icon = req.files.icon.data;
      const imgSrc = await saveImage(
        icon,
        product._id,
        uploadPath,
        product.imgSrc,
        date
      );
      product.imgSrc = imgSrc;
    }

    await product.save();

    res.status(200).send();
  } catch (e) {
    console.log(e.message);
    res.status(400).send(e.message);
  }
});

//OK
router.delete("/remove", adminAuth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.body._id });

    if (!product) {
      res.status(404).send();
    }
    await removeImage(uploadPath, product.imgSrc);
    res.send();
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.get("/orders", adminAuth, async (req, res) => {
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
    console.log(e.message);
    res.status(400).send(e.message);
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
        let totalPrice = 0;
        let totalExperience = 0;
        let totalAwards = [];
        user.activeOrder[currentMember].products.forEach(product => {
          totalPrice += product.product.price * product.quantity;

          totalExperience += product.product.experience * product.quantity;
          product.product.awards.forEach(award => {
            award.quantity = award.quantity * product.quantity
          })
         
            totalAwards = totalAwards.concat(product.product.awards);
          
        });
       // console.log(totalPrice, totalExperience, totalAwards);

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
  const user = req.user;
  try {

    if(user.party){
      const party = await Party.findOne({_id: user.party, leader: user._id})

      if(!party){
        throw new Error('Invalid party conditions!')
      }
    }

    const shop = await Product.find({}).populate({
      path: "awards.itemModel",
      populate: { path: "perks.target.disc-product", select: "_id name" }
    });

    const missionInstance = await MissionInstance.findOne(
      {party: {$elemMatch: {profile: user._id}}}    
    )

    if(missionInstance){
      await missionInstance.remove()
    }

    await updatePerks(user, false);

    if (user.activeOrder.length) {
      await user
        .populate({
          path: "activeOrder.profile",
          select: "_id name avatar bag equipped userPerks"
        })
        .populate({
          path: "activeOrder.awards.itemModel",
          select: "name imgSrc"
        })
        .execPopulate();
    }

    if (user.party) {
      await user
        .populate({
          path: "party",
          populate: {
            path: "leader members",
            select: "bag equipped name _id avatar bag userPerks",
            populate: {
              path: "bag",
              populate: {
                path: "itemModel",
                populate: {
                  path: "perks.target.disc-product",
                  select: "_id name"
                }
              }
            }
          }
        })
        .execPopulate();
    }
    if (user.party && !user.party.inShop) {
      user.party.inShop = true;
      await user.party.save(); //NOTE: can be saved like this -> user.party is now Mongo model due to population and no use toObject method

      //SAFE OPTION:
      //await Party.updateOne({_id: user.party._id}, {$set: {inShop: true}})
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

router.get('/activeOrder', auth, async(req, res) => {
  try {
    const user = req.user
    if(user.activeOrder && user.activeOrder.length > 0){
      return res.send(true)
    }else{
      return res.send(false)
    }
  } catch (error) {
    res.sendStatus(400)
  }
})

router.patch("/leave", auth, async (req, res) => {
  const user = req.user;
  try {
    if (user.party) {
      await user.populate({ path: "party" }).execPopulate();
      user.party.inShop = false;
      await user.party.save();
      //TO CHECK
      //await Party.updateOne({_id: user.party._id}, {$set: {inShop: false}})
      res.send(user.party._id);
    } else {
      res.sendStatus(200);
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e.message);
  }
});

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

  const secretKey = process.env.SECRET_RECAPTCHA_KEY;
  const recaptchaToken = req.body.token;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

  try {
    await verifyCaptcha(url);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
    return;
  }

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
    const momentDate = moment
      .utc(new Date())
      .add("5", "minutes")
      .toDate();

    order[0].createdAt = momentDate;
    user.activeOrder = order;

    await calculateOrder(user);

    await user
    .populate({
      //populate after verification
      path: "activeOrder.profile",
      select: "_id name avatar"
    })
    .populate({
      path: "activeOrder.products.product",
      populate: {
        path: "awards.itemModel",
        populate: { path: "perks.target.disc-product", select: "_id name" }
      } //is necessary here?
    })
    .populate({
      path: "activeOrder.awards.itemModel",
      select: "name imgSrc"
    })
    .execPopulate();
    
   
    await user.save();


    //WORKING! AS COMMENT FOR TESTS
    /*
        setTimeout(async () => {
            user.activeOrder = []
            await user.save()
        }, 5*60*1000); //removing activeOrder after 5 minutes
        */

    res.send(user.activeOrder);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.patch("/cancel", auth, async (req, res) => {
  const user = req.user;
  try {
    if (user.activeOrder.length <= 0) {
      throw new Error(`No active order exists (user: ${user._id})!`);
    }
    const orderArchived = await ArchiveOrder.findById(user.activeOrder._id);
    if (orderArchived) {
      throw new Error(`Order ${user.activeOrder._id} was already verified!`);
    }

    user.activeOrder = [];
    await user.save();
    res.sendStatus(200);
  } catch (error) {
    res.status(400).send(e.message);
  }
});

//DEVELOP: BARMANAUTH?!
//OK BUT TO DEVELOP
router.get("/verify/:id", barmanAuth, async (req, res) => {
  try {
    const user = await User.findOne({
      $and: [
        { _id: req.params.id },
        //{party: partyId},
        { activeOrder: { $not: { $size: 0 } } } //size does not accept ranges
      ]
    });

    if(!user){
      throw new Error('Invalid order conditions!')
    }

    // await user
    // .populate({
    //   path: "activeOrder.awards.itemModel", select: "name imgSrc"
    // }).populate({path: 'activeOrder.profile', select: '_id name avatar equipped'})
    // .execPopulate();

    await user
      .populate({
        //populate after verification
        path: "activeOrder.profile",
        select: "_id name avatar"
      })
      .populate({
        path: "activeOrder.products.product",
        populate: {
          path: "awards.itemModel",
          populate: { path: "perks.target.disc-product", select: "_id name" }
        } //is necessary here?
      })
      .populate({
        path: "activeOrder.awards.itemModel",
        select: "name imgSrc"
      })
      .execPopulate();

    await calculateOrder(user);



    res.status(200).send(user.activeOrder);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//DEVELOP: BARMANAUTH?!
router.post("/finalize", barmanAuth, async (req, res) => {

  

  const user = await User.findOne({
    $and: [
      { _id: req.body.userId },
      //{party: partyId},
      { activeOrder: { $not: { $size: 0 } } } //size does not accept ranges
    ]
  });

  if(!user){
    throw new Error('Invalid order conditions!')
  }

  const frontEndOrder = req.body.currentOrder


  
  try {
    //const order = await ArchiveOrder.findById(req.body.order)
    const activeRally = await Rally.findOne({
      $and: [
        { startDate: { $lte: moment() } },
        { expiryDate: { $gte: moment() } }
      ]
    });


    if(user.activeOrder.length <= 0){
      throw new Error("Brak aktywnego zamówienia dla tego użytkownika!")
    }

    user.activeOrder.forEach((basket, index) => {
      if((basket._id.toString() !== frontEndOrder[index]._id) || basket.price !== frontEndOrder[index].price){
        throw new Error(`Koszyk numer ${index+1} nieprawidłowy!`)
      }
    })


    let party = await Party.findById(user.party)
  

    const orderPartyIds = user.activeOrder.map(basket => basket.profile.toString())
    
    if(!party){
      if(orderPartyIds.length > 1){
        throw new Error("Wielokrotne koszyki dla pojedynczego użytkownika!")
      }

    }else{
      party.members = [party.leader, ...party.members]

      if(party.leader.toString() !== orderPartyIds[0] ){
        throw new Error("Błąd weryfikacji lidera drużyny!")
      }
      party.members.forEach((member, index) => {
        if(member.toString() !== orderPartyIds[index]){
          throw new Error(`Niezgodność członka drużyny z koszykiem o numerze ${index+1}!`)
        }
      })
      await user.populate({path: 'party'}).execPopulate()
    }
    

    // else{
    //   await user.populate({path: "party"}).execPopulate()
    // }
    // // console.log(party.members, user.party.members)
    // if (
    //   party.name !== user.party.name ||
    //   party.leader.toString() !== user.party.leader.toString() ||
    //   isEqual(party.members, user.party.members)
    // ) {
      
    // }



    
    const archive = {leader: req.body.userId, totalPrice: 0, users: []}

    await asyncForEach(user.activeOrder, async basket => {

      const member = await User.findById(basket.profile)

      const exp = basket.experience;
      const items = [];
      await asyncForEach(basket.awards, async award => {
        for(let i = 0; i < award.quantity; i++){
          const newAward = await Item({itemModel: award.itemModel, owner: member._id})
          await newAward.save()
          items.push(newAward._id)
        }
      })


      const newLevels = designateNewLevels(member.experience, exp);
  
      await member.updateOne(
        {
          $addToSet: { bag: { $each: items } },
          $inc: { experience: exp, levelNotifications: newLevels }
        }
      );

      if (activeRally && !activeRally.users.includes(member._id.toString() /*!!! toString() - to CHECK! */)) {
        activeRally.users = [...activeRally.users, member._id];
        await activeRally.save();
      }

      if(basket.products.length > 0 && member.equipped.scroll){
        const scroll = await Item.findById(member.equipped.scroll)
        if(scroll){
          scroll.remove()
        }
      }
      archive.totalPrice += basket.price
      archive.users.push(basket)
    });


    const newArchiveOrder = new ArchiveOrder(archive)
    await newArchiveOrder.save()
    user.activeOrder = []
    await user.save()


    res.send();
  } catch (e) {
    console.log(e)
    res.status(500).send(e.message);
  }
});

////TESTS
// router.post('/testAddMockOrders', adminAuth, async(req,res) => {

//   const userId = req.user._id

//   const mockOrders = [
//     {leader: userId, totalPrice: 41.5},
//     {leader: userId, totalPrice: 12},
//     {leader: userId, totalPrice: 11.5},
//     {leader: userId, totalPrice: 1000},
//     {leader: userId, totalPrice: 141.5},
//     {leader: userId, totalPrice: 1222},
//     {leader: userId, totalPrice: 91.5},
//     {leader: userId, totalPrice: 997.12},
//     {leader: userId, totalPrice: 41.5},
//     {leader: userId, totalPrice: 12},
//     {leader: userId, totalPrice: 11.5},
//     {leader: userId, totalPrice: 1000},
//     {leader: userId, totalPrice: 141.5},
//     {leader: userId, totalPrice: 1222},
//     {leader: userId, totalPrice: 91.5},
//     {leader: userId, totalPrice: 997.12},
//     {leader: userId, totalPrice: 41.5},
//     {leader: userId, totalPrice: 12},
//     {leader: userId, totalPrice: 11.5},
//     {leader: userId, totalPrice: 1000},
//     {leader: userId, totalPrice: 141.5},
//     {leader: userId, totalPrice: 1222},
//     {leader: userId, totalPrice: 91.5},
//     {leader: userId, totalPrice: 997.12},
//     {leader: userId, totalPrice: 41.5},
//     {leader: userId, totalPrice: 12},
//     {leader: userId, totalPrice: 11.5},
//     {leader: userId, totalPrice: 1000},
//     {leader: userId, totalPrice: 141.5},
//     {leader: userId, totalPrice: 1222},
//     {leader: userId, totalPrice: 91.5},
//     {leader: userId, totalPrice: 997.12},
//     {leader: userId, totalPrice: 41.5},
//     {leader: userId, totalPrice: 12},
//     {leader: userId, totalPrice: 11.5},
//     {leader: userId, totalPrice: 1000},
//     {leader: userId, totalPrice: 141.5},
//     {leader: userId, totalPrice: 1222},
//     {leader: userId, totalPrice: 91.5},
//     {leader: userId, totalPrice: 997.12},
//     {leader: userId, totalPrice: 41.5},
//     {leader: userId, totalPrice: 12},
//     {leader: userId, totalPrice: 11.5},
//     {leader: userId, totalPrice: 1000},
//     {leader: userId, totalPrice: 141.5},
//     {leader: userId, totalPrice: 1222},
//     {leader: userId, totalPrice: 91.5},
//     {leader: userId, totalPrice: 997.12},
//     {leader: userId, totalPrice: 41.5},
//     {leader: userId, totalPrice: 12},
//     {leader: userId, totalPrice: 11.5},
//     {leader: userId, totalPrice: 1000},
//     {leader: userId, totalPrice: 141.5},
//     {leader: userId, totalPrice: 1222},
//     {leader: userId, totalPrice: 91.5},
//     {leader: userId, totalPrice: 997.12},
//     {leader: userId, totalPrice: 41.5},
//     {leader: userId, totalPrice: 12},
//     {leader: userId, totalPrice: 11.5},
//     {leader: userId, totalPrice: 1000},
//     {leader: userId, totalPrice: 141.5},
//     {leader: userId, totalPrice: 1222},
//     {leader: userId, totalPrice: 91.5},
//     {leader: userId, totalPrice: 997.12},
//     {leader: userId, totalPrice: 41.5},
//     {leader: userId, totalPrice: 12},
//     {leader: userId, totalPrice: 11.5},
//     {leader: userId, totalPrice: 1000},
//     {leader: userId, totalPrice: 141.5},
//     {leader: userId, totalPrice: 1222},
//     {leader: userId, totalPrice: 91.5},
//     {leader: userId, totalPrice: 997.12},
//     {leader: userId, totalPrice: 41.5},
//     {leader: userId, totalPrice: 12},
//     {leader: userId, totalPrice: 11.5},
//     {leader: userId, totalPrice: 1000},
//     {leader: userId, totalPrice: 141.5},
//     {leader: userId, totalPrice: 1222},
//     {leader: userId, totalPrice: 91.5},
//     {leader: userId, totalPrice: 997.12},
//     {leader: userId, totalPrice: 41.5},
//     {leader: userId, totalPrice: 12},
//     {leader: userId, totalPrice: 11.5},
//     {leader: userId, totalPrice: 1000},
//     {leader: userId, totalPrice: 141.5},
//     {leader: userId, totalPrice: 1222},
//     {leader: userId, totalPrice: 91.5},
//     {leader: userId, totalPrice: 997.12},

//   ];

//   try{
//     await ArchiveOrder.insertMany(mockOrders)
//     res.send(mockOrders.map((order) =>  order.leader))
//   }catch(e){
//     res.status(400).send(e.message)
//   }
// })

export const productRouter = router;
