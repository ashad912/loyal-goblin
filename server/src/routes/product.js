import express from "express";
import { Product } from "../models/product";
import { adminAuth } from "../middleware/adminAuth";
import { auth } from "../middleware/auth";
import {isEqual, pick} from "lodash";
import moment from "moment";
import {
  asyncForEach,
  removeImage,
  savePNGImage,
  verifyCaptcha
} from "../utils/methods";
import { Rally } from "../models/rally";
import { User } from "../models/user";
import { OrderExpiredEvent } from "../models/orderExpiredEvent";
import { Party } from "../models/party";
import { Item } from "../models/item";
import { ArchiveOrder } from "../models/archiveOrder";
import { MissionInstance } from '@models/missionInstance'
import { barmanAuth } from "../middleware/barmanAuth";

const uploadPath = "../static/images/products/";

const orderValidTimeInMins = "5"
const timeUnit = "minutes"

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
      const imgSrc = await savePNGImage(
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
      const imgSrc = await savePNGImage(
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


//OK
router.get("/shop", auth, async (req, res) => {
  const user = req.user; 
  const socketConnectionStatus = req.query.socketConnectionStatus === "true"
 
  try {

    if(user.party){
      const party = await user.validatePartyAndLeader()
      if(req.query.socketConnectionStatus !== undefined){
        if(party && party.members.length && !socketConnectionStatus){ //if client of multiplayer shopping is not connected to socket
            throw new Error('Leader not connected to party members!')
        }
      }
    }
    
    const shop = await Product.find({}).populate({
      path: "awards.itemModel",
      populate: { path: "perks.target.disc-product", select: "_id name" }
    });

    await MissionInstance.removeIfExists(user._id)

    await user.updatePerks(false);

   
    //if user left shop before 5 min countdown and returned after countdown but before orderExpiredEvent removed user.activeOrder - clear order 
    if(user.activeOrder.length && moment.utc().valueOf() >= moment.utc(user.activeOrder[0].createdAt).add(orderValidTimeInMins, timeUnit).valueOf()){
      await user.clearActiveOrder()
    }


    if (user.activeOrder.length) {
      await user.orderPopulate()
      // await user
      //   .populate({
      //     path: "activeOrder.profile",
      //     select: "_id name avatar bag equipped userPerks attributes"
      //   })
      //   .populate({
      //     path: "activeOrder.awards.itemModel",
      //     select: "name imgSrc"
      //   })
      //   .execPopulate();
    }

    if (user.party) {
      await user
        // .populate({
        //   path: "party",
        //   populate: {
        //     path: "leader members",
        //     select: "bag equipped name _id avatar attributes userPerks",
        //     populate: {
        //       path: "bag",
        //       populate: {
        //         path: "itemModel",
        //         populate: {
        //           path: "perks.target.disc-product",
        //           select: "_id name"
        //         }
        //       }
        //     }
        //   }
        // })
        .partyPopulate()
        .execPopulate();

        for(let i=0; i<user.party.members.length; i++){
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
    console.log(e.message)
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
    console.log(e);
    res.status(400).send(e.message);
  }
});





//OK
router.patch("/activate", auth, async (req, res) => {
  const order = req.body.order;
  const user = req.user;

  // const secretKey = process.env.SECRET_RECAPTCHA_KEY;
  // const recaptchaToken = req.body.token;
  // const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

  try {
    await verifyCaptcha(req.body.token);
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
      .add(orderValidTimeInMins, timeUnit)
      .toDate();

    order[0].createdAt = momentDate;
    user.activeOrder = order;

    await user.calculateOrder();
    await user.orderPopulate()
    await user.save();
    
    if(process.env.REPLICA === "true"){
      //just for sure - if order expired event from previous order still exists in db
      const previousOrderEvent = await OrderExpiredEvent.findById(user._id)

      if(previousOrderEvent){
        await previousOrderEvent.remove()
      }

      //create new expired event
      await OrderExpiredEvent.create({_id : user._id})
    }
    
    //LEGACY NOREPLICA: prevents removing valid order - TIMER IS NOT CLEANED
    if(process.env.REPLICA === "false"){
      setTimeout(async () => {
        try{
          const result = await User.updateOne(
            {_id: user._id, 'activeOrder': {$elemMatch: {createdAt: user.activeOrder[0].createdAt}}},
            {$set: {activeOrder: []}}
          )
         // console.log(result)
        }catch(e){
          console.log(e.message)
        }
          
        
      }, 5*60*1000 + 1000); //removing activeOrder after 5 minutes (+1 second)
    }
    
    

    res.send(user.activeOrder);
  } catch (e) {
    console.log(e)
    res.status(400).send(e.message);
  }
});

router.patch("/cancel", auth, async (req, res) => {
  let user = req.user;
  try {

    if(user.party){
      await user.validatePartyAndLeader()
    }

    if (user.activeOrder.length <= 0) {
      throw new Error(`No active order exists (user: ${user._id})!`);
    }
    const orderArchived = await ArchiveOrder.findById(user.activeOrder._id);
    if (orderArchived) {
      throw new Error(`Order ${user.activeOrder._id} was already verified!`);
    }

    await user.clearActiveOrder()

    //user.activeOrder = [];
    //await user.save();
    res.sendStatus(200);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//OK
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
      throw new Error('Nie znaleziono zamówienia!')
    }

    if(user.party){
      await user.validatePartyAndLeader()
    }
    
    await user.calculateOrder();
    await user.orderPopulate()
    

    res.status(200).send(user.activeOrder);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/finalize", barmanAuth, async (req, res) => {

  
  try {
    const user = await User.findOne({
      $and: [
        { _id: req.body.userId },
        { activeOrder: { $not: { $size: 0 } } } //size does not accept ranges
      ]
    });
  
    if(!user){
      throw new Error('Użytkownik anulował zamówienie!')
    }
  
    const frontEndOrder = req.body.currentOrder
    


    if(user.activeOrder.length <= 0){
      throw new Error("Brak aktywnego zamówienia dla tego użytkownika!")
    }

    user.activeOrder.forEach((basket, index) => {
      if((basket._id.toString() !== frontEndOrder[index]._id) || basket.price !== frontEndOrder[index].price){
        throw new Error(`Koszyk numer ${index+1} nieprawidłowy!`)
      }
    })



    const orderPartyIds = user.activeOrder.map(basket => basket.profile.toString())
    
    if(!user.party){
      if(orderPartyIds.length > 1){
        throw new Error("Wielokrotne koszyki dla pojedynczego użytkownika!")
      }

    }else{

      const party = await user.validatePartyAndLeader()
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
    

    const activeRally = await Rally.findOne({
      $and: [
        { startDate: { $lte: moment() } },
        { expiryDate: { $gte: moment() } }
      ]
    });
 
    const archive = {leader: req.body.userId, totalPrice: 0, users: []}

    await asyncForEach(user.activeOrder, async basket => {

      const member = await User.findById(basket.profile)

      const exp = basket.experience;
      const items = [];
      let newShopAwards = []
      if(member.shopNotifications.awards && member.shopNotifications.awards.length){
          newShopAwards = [...member.shopNotifications.awards]
      }
      await asyncForEach(basket.awards, async item => {

        const index = newShopAwards.findIndex((award) => award.itemModel.toString() === item.itemModel.toString())
        if(index > -1){
            newShopAwards[index].quantity += item.quantity
        }else{
            newShopAwards = [...newShopAwards, {quantity: item.quantity, itemModel: item.itemModel}] 
        }

        for(let i = 0; i < item.quantity; i++){
          const newAward = await Item({itemModel: item.itemModel, owner: member._id})
          await newAward.save()
          items.push(newAward._id)
        }
      })


      const newLevels = member.getNewLevels(exp);

      const isNewFlag = exp > 0 || newShopAwards.length ? true : false

      const scroll = basket.products.length > 0 && member.equipped.scroll ? await Item.findById(member.equipped.scroll) : null
      
      if(scroll){
        await scroll.remove()
      }
      
      const updatedUserPerks = scroll ? await user.updatePerks(true, true) : member.userPerks

      
      

      await User.updateOne(
        {_id: member._id},
        {
          $addToSet: { bag: { $each: items } },
          $inc: { experience: exp, levelNotifications: newLevels, 'shopNotifications.experience': exp },
          $set: {'userPerks': updatedUserPerks,'shopNotifications.isNew': isNewFlag, 'shopNotifications.awards': newShopAwards, 'activeOrder': []},
        }
      );

      if(process.env.REPLICA === "true"){
        const orderExpiredEvent = await OrderExpiredEvent.findById(user._id)

        if(orderExpiredEvent){
            await orderExpiredEvent.remove()
        }
      }
      

      if (activeRally) {
        const userIndex = activeRally.users.findIndex((user) => user.profile.toString() === member._id.toString())

        if(userIndex > -1){
          activeRally.users[userIndex].experience += exp
        }else{
          activeRally.users = [...activeRally.users, {profile: member._id, experience: exp}];
        }
        await activeRally.save();
        
      }

      
      archive.totalPrice += basket.price
      archive.users.push(basket)
    });


    const newArchiveOrder = new ArchiveOrder(archive)
    await newArchiveOrder.save()
   // user.activeOrder = []
    //await user.save()


    res.send();
  } catch (e) {
    console.log(e)
    res.status(500).send(e.message);
  }
});



export const productRouter = router;
