import express from "express";
import bcrypt from "bcryptjs";
import validator from 'validator'
import {differenceBy} from 'lodash'
import { User, userClasses, userSexes } from "../models/user";
import { Party } from "../models/party";
import { Item } from "../models/item";
import { ItemModel } from "../models/itemModel";
import { MissionInstance } from "../models/missionInstance";
import { auth } from "../middleware/auth";
import { adminAuth } from '../middleware/adminAuth';
import {
  asyncForEach,
  savePNGImage,
  removeImage,
  verifyCaptcha,
  getEndpointError
} from "@utils/functions";
import moment from "moment";
import createEmail from '../emails/createEmail'

import EndpointError from '@utils/EndpointError'

const router = express.Router();



const uploadPath = "../static/images/avatars/"



////ADMIN-SIDE

router.get('/adminUsers', adminAuth, async (req, res) => {
  try{
    const users = await User.aggregate().match({}).sort({"lastActivityDate": -1}).project({
      '_id': 1,
      'name': 1,
      'avatar': 1,
      'active': 1,
      'experience': 1,
      'lastActivityDate': 1,
  
    })

    res.send(users)
  }catch(e){
    res.status(500).send(e)
  }
  
})

const toggleBan = async (userId, status) => {
  const result = await User.updateOne(
    {_id: userId},
    {$set: {active: status}}
  )

  if(!result.n){
    throw Error('User not found!')
  }
  return
}

router.patch('/ban', adminAuth, async (req, res) => {
  try{
    await toggleBan(req.body._id, false)

    const party = await Party.findOne({
      $or: [
        { leader: req.body._id },
        { members: { $elemMatch: { $eq: req.body._id } } }
      ]
    })

    if(party){
      await party.remove()
    }
    
    res.send()
  }catch(e){
    res.status(500).send(e.message)
  }
})

router.patch('/unban', adminAuth, async (req, res) => {
  try{
    await toggleBan(req.body._id, true)
    res.send()
  }catch(e){
    res.status(500).send(e.message)
  }
})


////USER-SIDE

router.post("/create", async (req, res, next) => {
  //registerKey used in biometrica, hwvr we may allow registration for ppl with key from qrcode - i left it

  
  if(process.env.NODE_ENV === "dev" && req.body.registerKey){
    const isMatch = await bcrypt.compare(
      req.body.registerKey,
      process.env.REGISTER_KEY
    );

    if (!isMatch) {
      const e = new Error('Please authenticate')
      e.type = 'warn'
      throw e
    }
  }else{

    if (!req.body.token) {
      const e = new Error('No token provided')
      e.type = 'warn'
      throw e
    }
    try{
      await verifyCaptcha(req.body.token)
    }catch(e){
      e.status = 400
      next(e)
      return
    }
  }

  try {
    const user = new User({
      email: req.body.email.toLowerCase(),
      password: req.body.password,
      active: true,
      perksUpdatedAt: moment().toISOString(),
      activeOrder: [],
      loyal: {}
    });
  
    const token = await user.generateAuthToken(); //on instancegenerateAuthToken

    await user.save(); //this method holds updated user!
    res.cookie("token", token, { maxAge: 2592000000, httpOnly: true }).status(201).send(user);
  } catch (e) {
    e.status = 400
    next(e)
  }
});

router.get("/allNames", auth, async (req, res, next) => {
  try {
    const allNames = await User.find({}, 'name')
    res.status(200).send(allNames)
  } catch (e) {
    e.status = 400
    next(e)
  }

})


router.patch("/character", auth, async (req, res, next) => {
  try {
    const user = req.user

    if(user.name){
      const e = new Error(`User has already filled character data - UID: ${req.user._id}`)
      e.type = 'warn'
      throw e
    }
    
    const name = req.body.name.toLowerCase()
    const sex = req.body.sex
    const characterClass = req.body.characterClass
    const attributes = req.body.attributes


    if(!userClasses.includes(characterClass)){
      throw getEndpointError('warn', 'User has already filled character data', req.user._id)
    }

    if(!userSexes.includes(sex)){
      throw getEndpointError('warn', 'Invalid sex form data field', req.user._id)
    }

    if(!name || !sex || !characterClass || !attributes){
      throw getEndpointError('warn', 'Missing data', req.user._id)
    }

    if(parseInt(attributes.strength) + parseInt(attributes.dexterity) + parseInt(attributes.magic) + parseInt(attributes.endurance) > 8){
      throw getEndpointError('warn', 'Invalid sum of attributes', req.user._id)
    }

    if(characterClass === 'warrior' && attributes.strength <= 1){
      throw getEndpointError('warn', 'Invalid strength value', req.user._id)
    }

    if(characterClass === 'rogue' && attributes.dexterity <= 1){
      throw getEndpointError('warn', 'Invalid dexterity value', req.user._id)
    }

    if(characterClass === 'mage' && attributes.magic <= 1){
      throw getEndpointError('warn', 'Invalid mage value', req.user._id)
    }

    if(characterClass === 'cleric' && attributes.endurance <= 1){
      throw getEndpointError('warn', 'Invalid endurance value', req.user._id)
    }

    const sameNameUser = await User.findOne({name: name})
    if(sameNameUser){
      throw getEndpointError('warn', 'This name has already used', req.user._id)
    }


    user.name = name
    user.sex = sex
    user.class = characterClass
    user.attributes = {...attributes}
    await user.save()



    res.status(201).send(user)
  } catch (e) {
    console.log(e)
    res.status(400).send(e);
  }
});


router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email.toLowerCase(), req.body.password);
    const token = await user.generateAuthToken(); 
    
    await user.updatePerks(true)
    await user.standardPopulate()
    
    if(user.passwordChangeToken){
      user.passwordChangeToken = null
      await user.save()
    }
    
    res
      .cookie("token", token, { maxAge: 2592000000, httpOnly: true })
      .send(user); //cookie lifetime: 30 days (maxAge in msc)
  } catch (e) {
    console.log(e)
    res.status(400).send(e);
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.clearCookie("token").send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//OK
router.patch("/updatePerks", auth, async (req, res, next) => {
  const user = req.user;

  try {
    await user.updatePerks(true)
    res.send(user.userPerks);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/me", auth, async (req, res, next) => {
  try {
    const user = req.user
    
    
    
    await user.updatePerks(false)
    
    // if(user.party){
    //   await user.populate({
    //     path: "party"
    //   });
    // }

    if (user.activeOrder.length) {
      await user.orderPopulate()
    }

    await user.standardPopulate();

    

    res.send(user);
  } catch (e) {
    e.status = 400
    next(e)
  }
});



router.patch("/changePassword", auth, async (req, res, next) => {
  
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.password;
  const repeatedNewPassword = req.body.confirmPassword

  try{
    await verifyCaptcha(req.body.token)
  }catch(e){
    e.status = 400
    next(e)
    return
  }

  try {
  
    if(!oldPassword || !newPassword || !repeatedNewPassword){
      throw getEndpointError('warn', 'Incomplete data', req.user._id)
    }
    if(newPassword !== repeatedNewPassword){
      throw getEndpointError('warn', 'Passwords do not match', req.user._id)
    }
      const user = await req.user.updatePassword(oldPassword, newPassword);
      await user.save();
      res.send(user);
    } catch (e) {
      e.status = 400
      next(e)
    }
  });


router.post("/forgotPassword", async (req, res, next) => {
  try {
  
  
    try{
      await verifyCaptcha(req.body.recaptchaToken)
    }catch(e){
      e.status = 400
      next(e)
      return
    }

    const email = req.body.email
    if(!validator.isEmail(email)){
      throw getEndpointError('warn', 'Invalid email')
    }
    const user = await User.findOne({email})
    if(!user){
      throw getEndpointError('warn', 'There is no such email in db')
    }

    if(user.passwordChangeToken){
      
      if(!user.checkPasswordChangeTokenExpired(user.passwordChangeToken)){
        throw getEndpointError('info', 'jwt not expired')
      }
    }

    const token = await user.generatePasswordResetToken()
    createEmail(res, user.email, "Reset hasła", 'passwordReset',
    { locale: 'pl', token: `http://${req.headers.host}/reset/${token}`, userName: user.name })

  } catch (e) {
    e.status = 400
    next(e)
  }
})

router.post("/validatePasswordChangeToken", async (req, res, next) => {
  const token = req.body.token
  try {
    if (!token) {
      throw getEndpointError('warn', 'No token provided')
    }
  
    const user = await User.findByPasswordChangeToken(token)
    if(!user){
      throw getEndpointError('warn', 'User data error')
    }

    res.sendStatus(200)
    
  } catch (e) {
    e.status = 400
    next(e)
  }
  
})


router.patch('/reset', async (req, res, next) => {
  try {
   
    try{
      await verifyCaptcha(req.body.recaptchaToken)
    }catch(e){
      e.status = 400
      next(e)
      return
    }

    const token = req.body.token

    if (!token) {
      throw getEndpointError('warn', 'No token provided')
    }
    if(req.body.password !== req.body.confirmPassword){
      throw getEndpointError('warn', 'Passwords do not match')
    }
    const user = await User.findByPasswordChangeToken(token)
    if (!user) {
      throw getEndpointError('warn', 'User data error')
    }

    user.passwordChangeToken = null
    user.password = req.body.password

    await user.save()

    res.sendStatus(200)
  } catch (e) {
    e.status = 400
    next(e)
  }
})

// router.post("/me/avatar", auth, upload.single("avatar"), async (req, res) => {
//     //to have access to file here, we have to delete 'dest' prop from multer
//     //req.ninja.avatar = req.file.buffer //saved in binary data- base64 - it's possible to render img from binary
//     const buffer = await sharp(req.file.buffer)
//       .resize({ width: 100, height: 100 })
//       .png()
//       .toBuffer(); //convert provided img to png and specific size
//     req.user.avatar = buffer;

//     await req.user.save();
//     const user = await userPopulateBag(req.user)
//     res.send(user);
//   },
//   (err, req, res, next) => {
//     res.status(400).send({ error: err.message }); //before app.use middleware with 422
//   }
// );

router.post("/me/avatar", auth, async (req, res, next) => {
  try {
    if (!req.files) {
      throw getEndpointError('warn', 'No file provided', req.user._id)
    }
    const user = req.user
    //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
    let avatar = await req.files.avatar.data;

    const avatarName = await savePNGImage(avatar, user._id, uploadPath, user.avatar)
    
    user.avatar = avatarName;
    await user.save();
    await user.standardPopulate();
    res.send(user);

    
  } catch (e) {
    e.status = 400
    next(e)
  }
});

router.delete("/me/avatar", auth, async (req, res, next) => {
  const user = req.user
  try {
    if(!user.avatar){
      throw getEndpointError('warn', 'User has not got avatar', req.user._id)
    }

    await removeImage(uploadPath + user.avatar)
    user.avatar = null;
    await user.save();
    await user.standardPopulate();
    res.send(user);

  }
   catch (e) {
    e.status = 400
    next(e)
  }
});



router.patch("/party/equip", auth, async (req, res) => {
  try {

    const leader = req.user
    const itemId = req.body.id;

    if(!req.body.memberId){
      throw new Error('No memberId field!')
      
    }
    const party = await Party.findOne({_id: leader.party, inShop: true, leader: leader._id, members: {$elemMatch: {$eq: req.body.memberId}}})

    if(!party){
      throw new Error('Invalid party conditions!')
    }

    if(leader.party.toString() !== party._id.toString()){
      throw new Error('Leader party field mismatch!')
    }

    let user = await User.findById(req.body.memberId)

    if(user.party.toString() !== party._id.toString()){
      throw new Error('Member party field mismatch!')
    }
    
    const missionInstance = await MissionInstance.findOne(
      {party: {$elemMatch: {profile: user._id}}}    
    )

    if(missionInstance){
      throw new Error('Cannot equip item during mission!')
    }

    const item = await Item.findOne({_id: itemId, owner: req.body.memberId}).populate({
      path: 'itemModel',
      select: '_id type'
    })

    if(!item){
      throw new Error('Item not found or invalid owner prop!')
    }

    if(item.itemModel && item.itemModel.type !== 'scroll'){
      throw new Error('Item to equip must be a scroll!')
    }
  
    const itemToEquip = user.bag.find(item => {
      return item.toString() === itemId;
    });

    if(!itemToEquip){
      throw new Error('Item does not exist!')
    }

    user.equipped.scroll = user.equipped.scroll ? null : itemId
    
    await user.updatePerks(true)
    
    await user.save();
    await user.standardPopulate()

    if(!user.party){
      res.status(204).send(null)
      return
    }
    
    await user
      .populate({
        path: "party",
        populate: { path: "leader members", select: "_id name avatar attributes experience userPerks bag equipped class experience", 
        populate: { path: "bag", populate: { path: "itemModel", populate: { path: "perks.target.disc-product", select: '_id name' }, } } }
      })
      .execPopulate();

    res.send(user.party);
          
        
      

    
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

router.patch("/items/equip", auth, async (req, res) => {
  try {

    let user = req.user;
    const itemId = req.body.id;
    const equipped = req.body.equipped;


    const missionInstance = await MissionInstance.findOne(
      {party: {$elemMatch: {profile: user._id}}}    
    )

    if(missionInstance){
      throw new Error('Cannot equip item during mission!')
    }

    //const party = await Party.findOne({inShop: true, members: {$elemMatch: {$eq: user._id}}})
    const party = await Party.findById(user.party) //even user.party is null

    //check if user is party member when party is in shop
    if(party && party.inShop && party.members.map((memberId) => memberId.toString()).includes(user._id.toString())){
      throw new Error('Cannot equip item during shopping!')
    }
      

    const item = await Item.findOne({_id: itemId, owner: user._id}).populate({
      path: 'itemModel',
      select: '_id type'
    })

    if (!item) {
      throw new Error('Item not found or invalid owner prop!')
    }

    //check if party inShop leader equip scroll item type 
    if(party && party.inShop){
      if(item.itemModel && item.itemModel.type !== 'scroll'){
        throw new Error('Item to equip must be a scroll!')
      }
    }

    const itemToEquip = user.bag.find(item => {
      return item._id.toString() === itemId;
    });

    if (!itemToEquip) {
      throw new Error('There is no such item in bag!')
    }

    const checkEq = differenceBy(Object.values(equipped), user.bag, (item => item && item.toString()))
    if(checkEq.some(item => typeof item === 'string')){
      throw new Error("Equipped items do not match bag!")
    }
 
    if(equipped.ringLeft && equipped.ringRight && equipped.ringLeft === equipped.ringRight){
      throw new Error("Duplicated ring want to be equipped!")
    }

    if(equipped.weaponLeft && equipped.weaponRight && equipped.weaponLeft === equipped.weaponRight){
      throw new Error("Duplicated weapon want to be equipped!")
    }

    if(equipped.weaponRight){
      const weapon = await Item.findById(equipped.weaponRight).populate({
        path: 'itemModel',
        select: '_id twoHanded'
      })

      if(!weapon){
        throw new Error('Legacy weapon item id detected!')
      }
    
      if(weapon.itemModel.twoHanded && equipped.weaponLeft){
        throw new Error('Detected additional weapon on left hand when twohanded weapon is equipped!')
      }
    }

    if(equipped.weaponLeft){
      const weapon = await Item.findById(equipped.weaponLeft).populate({
        path: 'itemModel',
        select: '_id twoHanded'
      })

      if(!weapon){
        throw new Error('Legacy weapon item id detected!')
      }
    
      if(weapon.itemModel.twoHanded){
        throw new Error('Two handed weapon cannot be equipped on the left hand!')
      }
    }

    user.equipped = { ...equipped };

    await asyncForEach(Object.keys(equipped), async slot => {
      //console.log(slot)
      await user
        .populate({
          path: "equipped." + slot,
          populate: { path: "itemModel" }
        })
        .execPopulate();
        
        if(user.equipped[slot] && user.equipped[slot].itemModel.type){
          //exclude ringLeft, ringRight, weaponRight, weaponLeft
          const slotToType = slot.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').split('-')[0]  
          
          if(user.equipped[slot].itemModel.type !== slotToType){
            
            throw new Error("Inapprioprate itemModel type in equipped object!")
          }
        }

    });
    await user.updatePerks(true)

    //Depopulate equipped key
    user.equipped = { ...equipped };

    await user.save();
    await user.standardPopulate()
 
    
    res.status(200).send(user);

      
    
  } catch (e) {
    console.log(e);
    res.sendStatus(400);
  }
});

router.delete("/items/remove", auth, async (req, res) => {
  const user = req.user
  try {
    const party = await Party.findOne({_id: user.party, inShop: true})

    if(party){
      throw new Error("Cannot remove item when party is in shop!")
    }

    const missionInstance = await MissionInstance.findOne(
      {party: {$elemMatch: {profile: user._id}}}    
    )

    if(missionInstance){
      throw new Error('Cannot delete item during mission!')
    }

    const item = await Item.findById({ _id: req.body.itemId });
    await item.remove();

    //Fetch updated user - bag and equipped changed
    const updatedUser = await User.findById(user._id)
    await updatedUser.standardPopulate();

    res.status(200).send(updatedUser);
  } catch (e) {
    console.log(e);
    res.status(403).send();
  }
});

router.patch('/confirmLevel', auth, async(req, res) => {
  const user = req.user
  const pointType = req.body.pointType

  try{
    if(user.levelNotifications <= 0){
      throw new Error('Operation forbidden!')
    }

    if(!pointType){
      throw new Error('No point type field!')
    }

    switch(pointType){
      case 'strength':
        user.attributes.strength += 1
        break
      case 'dexterity':
        user.attributes.dexterity += 1
        break
      case 'magic':
        user.attributes.magic += 1
        break 
      case 'endurance':
        user.attributes.endurance += 1
        break
      default:
        throw new Error('Invalid point type field!')
    }

    user.levelNotifications -= 1
  
    await user.save()
    await user.standardPopulate()
    res.send(user)
  }catch(e){
    console.log(e.message)
    res.status(400).send(e.message);
  }
})

//OK
router.patch("/clearRallyAwards", auth, async (req, res) => {
  const user = req.user;

  try {
    if(!user.rallyNotifications.isNew){
      throw new Error('Operation forbidden!')
    }

    user.rallyNotifications = {isNew: false, experience: 0, awards: []};
    await user.save();
    await user.standardPopulate();
    res.send(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.patch("/clearShopAwards", auth, async (req, res) => {
  const user = req.user;

  try {
    if(!user.shopNotifications.isNew){
      throw new Error('Operation forbidden!')
    }

    user.shopNotifications = {isNew: false, experience: 0, awards: []};
    await user.save();
    await user.standardPopulate();
    res.send(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

const allFieldsTrue = loyal => {
  for (var field in loyal) {
    if (!loyal[field]) {
      return false;
    }
  }
  return true;
};

const verifyTorpedo = (user, fieldName) => {
  return new Promise(async (resolve, reject) => {
    try {
      await user
        .populate({
          path: "bag",
          populate: { path: "itemModel", populate: { path: "perks.target.disc-product", select: '_id name' }, }
        })
        .execPopulate();

      const torpedo = user.bag.find(
        bagItem =>
          bagItem.itemModel.type === "torpedo" &&
          bagItem.itemModel.name === fieldName
      );

      if (!torpedo) {
        throw new Error("Matching torpedo not found!");
      }

      const item = await Item.findById(torpedo._id);

      if (!item) {
        throw new Error("Item does not exist!");
      }

      if (item.owner.toString() !== user._id.toString()) {
        throw new Error("Owner field conflict!");
      }

      resolve(item);
    } catch (e) {
      reject(e);
    }
  });
};

router.patch("/loyal", auth, async (req, res) => {
  const user = req.user;

  const fieldName = req.body.field;
  try {
    if (!user.bag.length) {
      throw new Error("Bag is empty!");
    }

    const item = await verifyTorpedo(user, fieldName);

    const fieldValue = user.loyal[fieldName];
    if (fieldValue === null || fieldValue === undefined) {
      throw new Error("Field not found!");
    }

    if (fieldValue === true) {
      throw new Error("Field already shoted!");
    }

    await item.remove(); //user bag cleared by remove middleware

    let updatedUser = await User.findById(user._id);
    //updated by item removing middleware -> have to pass to resposne 'fresh' object
    //console.log(updatedUser.bag)
    updatedUser.loyal[fieldName] = true;
    const isAward = allFieldsTrue(updatedUser.loyal.toJSON());

    let awardToPass = null;
    if (isAward) {
      const awards = await ItemModel.find({ loyalAward: true });

      if (awards.length) {
        //get random award
        const randomAward = awards[Math.floor(Math.random() * awards.length)];

        //create item and add to updatedUser bag
        const newItem = new Item({
          itemModel: randomAward._id,
          owner: updatedUser._id
        });
        await newItem.save();
        //new item id -> normal js saving
        
        updatedUser.bag = [...updatedUser.bag, newItem._id];
        await newItem
          .populate({
            path: "itemModel", populate: { path: "perks.target.disc-product", select: '_id name' },
          })
          .execPopulate();

        awardToPass = newItem;
      }

      Object.keys(updatedUser.loyal.toJSON()).forEach(key => {
        updatedUser.loyal[key] = false; //IMPORTANT: overwriting keys!! important .toJSON() to not overwrite 'mongo keys'
      });
    }

    await updatedUser.save();
    await updatedUser.standardPopulate();

    res.send({ updatedUser, awardToPass });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get('/users', auth, async(req, res) => {
  try{
    const users = await User.aggregate().match({ active: true }).sort({"experience": -1 }).project({
      '_id': 1,
      'avatar': 1,
      'name': 1,
      'experience': 1,
    })

    const userIndex = users.findIndex((user) => { //return client rank position
          return user._id.toString() === req.user._id.toString()
    })
    const slicedUsers = users.slice(0, 50) //return first 50 users

    res.send({users: slicedUsers, userIndex})
  }catch(e){
    res.status(400).send()
  }
  
})


///TESTS

router.patch("/addUserItem", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.bag = [...user.bag, req.body.item];

    await user.save();
    res.send();
  } catch (e) {
    console.log(e.message);
    res.status(400).send();
  }
});

//WIP not working
router.get("/myItems", adminAuth, async (req, res) => {
  const user = req.user;

  try {
    await user.standardPopulate();

    const items = { bag: user.bag, equipped: user.equipped };
    res.send(items);
  } catch (error) {
    res.status(400).send();
  }
});

router.patch("/me", adminAuth, async (req, res, next) => {
  //TEST DEVELOP: get user from user id
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "password"];

  const isValidOperation = updates.every(update => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid update!" });
  }

  try {
    let user = req.user;
    updates.forEach(async (update) => {
      if(update === "password"){

          user = await req.user.updatePassword(req.body.password.oldPassword, req.body.password.newPassword)
//console.log(user)

      }else{
        user[update] = req.body[update]; //user[update] -> user.name, user.password itd.
      }
    });

    await user.save();

    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/testUpdateUser", adminAuth, async (req, res) => {
  const user = req.user;

  //await Item.deleteMany({owner: user._id})
  //what else - party logic? ->
  // await User.updateMany(
  //     {$or: [
  //         {'party.leader': user._id},
  //         {'party.members': { $elemMatch: {$eq: user._id}}}
  //     ]},
  //     {$set: {
  //         party: {members: []},
  //         activeOrder : {}
  //     }}
  // )
  //OK!

  //what else - rally
  // await Rally.updateMany(
  //     {"$and": [
  //         { users: { $elemMatch: {profile: user._id}}}, //wihout eq
  //         { $and: [{ activationDate: { $lte: new Date() } }, {expiryDate: { $gte: new Date() } }]}, //leave users in achive rallies
  //     ]},
  //     {$pull: {
  //         "users": {profile: user._id}
  //     }}
  // )

  //missionInstance
  // const missionInstance = await MissionInstance.findOne({party: {$elemMatch: {user: user._id}}}).populate({
  //     path: "items"
  // })

  // await asyncForEach((missionInstance.items), async item => {
  //     await User.updateOne({_id: item.owner}, {$addToSet: {bag: item._id}})
  // })
  try {
    await user.remove();
  } catch (e) {
    res.status(400).send(e.message);
  }
  res.send();

  // missionInstance.remove()
});

export const userRouter = router;
