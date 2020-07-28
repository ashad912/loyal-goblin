import express from "express";
import validator from 'validator'
import { differenceBy } from 'lodash'

import userService from '@services/user'
import { User, userClasses, userSexes } from "@models/user";
import { Party } from "@models/party";
import { Item } from "@models/item";
import { ItemModel } from "@models/itemModel";
import { MissionInstance } from "@models/missionInstance";
import { auth } from "@middleware/auth";
import { adminAuth } from '@middleware/adminAuth';
import { ERROR, WARN, INFO } from '@utils/constants'
import {
  asyncForEach,
  savePNGImage,
  removeImage,
  getEndpointError
} from "@utils/functions";
import moment from "moment";
import createEmail from '../emails/createEmail'
import { recaptcha } from "../middleware/recaptcha";


const router = express.Router();



const uploadPath = "../static/images/avatars/"



////ADMIN-SIDE

router.get('/adminUsers', adminAuth, async (req, res, next) => {
  try {
    const users = await userService.getUsers()

    res.send(users)
  } catch (e) {
    next(e)
  }

})

const toggleBan = async (userId, status) => {
  const result = await User.updateOne(
    { _id: userId },
    { $set: { active: status } }
  )

  if (!result.n) {
    throw getEndpointError(WARN, 'User not found', userId)
  }
}

router.patch('/ban', adminAuth, async (req, res, next) => {
  try {
    await toggleBan(req.body._id, false)

    const party = await Party.findOne({
      $or: [
        { leader: req.body._id },
        { members: { $elemMatch: { $eq: req.body._id } } }
      ]
    })

    if (party) {
      await party.remove()
    }

    res.send()
  } catch (e) {
    next(e)
  }
})

router.patch('/unban', adminAuth, async (req, res, next) => {
  try {
    await toggleBan(req.body._id, true)
    res.send()
  } catch (e) {
    next(e)
  }
})


////USER-SIDE

router.post("/create", recaptcha, async (req, res, next) => {

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
    next(e)
  }
});

router.get("/allNames", auth, async (req, res, next) => {
  try {
    const allNames = await User.find({}, 'name')
    res.status(200).send(allNames)
  } catch (e) {
    next(e)
  }

})


router.patch("/character", auth, async (req, res, next) => {
  try {
    const user = req.user

    if (user.name) {
      throw getEndpointError(WARN, 'User has already filled character data', req.user._id)
    }

    const name = req.body.name.toLowerCase()
    const sex = req.body.sex
    const characterClass = req.body.characterClass
    const attributes = req.body.attributes


    if (!userClasses.includes(characterClass)) {
      throw getEndpointError(WARN, 'User has already filled character data', req.user._id)
    }

    if (!userSexes.includes(sex)) {
      throw getEndpointError(WARN, 'Invalid sex form data field', req.user._id)
    }

    if (!name || !sex || !characterClass || !attributes) {
      throw getEndpointError(WARN, 'Missing data', req.user._id)
    }

    if (parseInt(attributes.strength) + parseInt(attributes.dexterity) + parseInt(attributes.magic) + parseInt(attributes.endurance) > 8) {
      throw getEndpointError(WARN, 'Invalid sum of attributes', req.user._id)
    }

    if (characterClass === 'warrior' && attributes.strength <= 1) {
      throw getEndpointError(WARN, 'Invalid strength value', req.user._id)
    }

    if (characterClass === 'rogue' && attributes.dexterity <= 1) {
      throw getEndpointError(WARN, 'Invalid dexterity value', req.user._id)
    }

    if (characterClass === 'mage' && attributes.magic <= 1) {
      throw getEndpointError(WARN, 'Invalid mage value', req.user._id)
    }

    if (characterClass === 'cleric' && attributes.endurance <= 1) {
      throw getEndpointError(WARN, 'Invalid endurance value', req.user._id)
    }

    const sameNameUser = await User.findOne({ name: name })
    if (sameNameUser) {
      throw getEndpointError(WARN, 'This name has already used', req.user._id)
    }


    user.name = name
    user.sex = sex
    user.class = characterClass
    user.attributes = { ...attributes }
    await user.save()

    await user.updatePerks(false)
    await user.standardPopulate()

    res.status(201).send(user)
  } catch (e) {
    next(e)
  }
});


router.post("/login", recaptcha, async (req, res, next) => {
  try {
    const user = await User.findByCredentials(req.body.email.toLowerCase(), req.body.password);
    const token = await user.generateAuthToken();

    await user.updatePerks(true)
    await user.standardPopulate()

    if (user.passwordChangeToken) {
      user.passwordChangeToken = null
      await user.save()
    }

    res
      .cookie("token", token, { maxAge: 2592000000, httpOnly: true })
      .send(user); //cookie lifetime: 30 days (maxAge in msc)
  } catch (e) {
    next(e)
  }
});


router.post("/demo/:id", recaptcha, async (req, res, next) => {

 
  try {
    if (req.params.id !== process.env.DEMO_KEY) {
      throw getEndpointError(WARN, 'Invalid demo key')
    }

    const existingDemoUsers = await User.find({ demo: true })

    const user = new User({
      _id: new require('mongoose').Types.ObjectId(),
      email: `demouser${existingDemoUsers.length}@goblin.demo`,
      password: process.env.DEMO_KEY,
      active: true,
      demo: true,
      perksUpdatedAt: moment().toISOString(),
      activeOrder: [],
      bag: [],
      loyal: {},
      experience: 60,
    });

    const createWeaponAndAddToBag = async (itemModel) => {
      const item = new Item({ itemModel: itemModel._id, owner: user._id })
      await item.save()
      user.bag = [...user.bag, item._id]
      return item._id
    }

    // Add one weapon
    const weapon = await ItemModel.findOne({ type: 'weapon', demo: true })

    if (weapon) {
      const weaponId = await createWeaponAndAddToBag(weapon)
      user.equipped.weaponLeft = weaponId
    }

    // Add one chest
    const chest = await ItemModel.findOne({ type: 'chest', demo: true })

    if (chest) {
      const chestId = await createWeaponAndAddToBag(chest)
      user.equipped.chest = chestId
    }

    // Add one legs
    const legs = await ItemModel.findOne({ type: 'legs', demo: true })

    if (legs) {
      const legsId = await createWeaponAndAddToBag(legs)
      user.equipped.legs = legsId
    }

    // Add one from each amulets...
    const amulets = await ItemModel.find({ type: 'amulet' })
    for (const itemModel of amulets) {
      await createWeaponAndAddToBag(itemModel)
    }

    // Add one from each torpedos...
    const torpedo = await ItemModel.find({ type: 'torpedo' })
    for (const itemModel of torpedo) {
      await createWeaponAndAddToBag(itemModel)
    }

    const token = await user.generateAuthToken();

    await user.updatePerks(true)
    await user.standardPopulate()

    if (user.passwordChangeToken) {
      user.passwordChangeToken = null
      await user.save()
    }

    const maxAge = 1800000
    setTimeout(async () => {
      await user.remove()
    }, maxAge)

    res
      .cookie("token", token, { maxAge, httpOnly: true })
      .send(user); //cookie lifetime: 30 mins (maxAge in msc)
  } catch (e) {
    next(e)
  }
});

router.post("/logout", auth, async (req, res, next) => {
  try {

    if (req.user.demo) {
      await req.user.remove()
      return res.clearCookie('token').send()
    }

    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.clearCookie("token").send();
  } catch (e) {
    next(e)
  }
});

router.post("/logoutAll", auth, async (req, res, next) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    next(e)
  }
});

//OK
router.patch("/updatePerks", auth, async (req, res, next) => {
  const user = req.user;

  try {
    await user.updatePerks(true)
    res.send(user.userPerks);
  } catch (e) {
    next(e)
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

    next(e)
  }
});



router.patch("/changePassword", auth, recaptcha, async (req, res, next) => {

  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.password;
  const repeatedNewPassword = req.body.confirmPassword

  try {

    if (!oldPassword || !newPassword || !repeatedNewPassword) {
      throw getEndpointError(WARN, 'Incomplete data', req.user._id)
    }
    if (newPassword !== repeatedNewPassword) {
      throw getEndpointError(WARN, 'Passwords do not match', req.user._id)
    }
    const user = await req.user.updatePassword(oldPassword, newPassword);
    await user.save();
    res.send(user);
  } catch (e) {
    next(e)
  }
});


router.post("/forgotPassword", recaptcha, async (req, res, next) => {
  try {

    const email = req.body.email

    if (!validator.isEmail(email)) {
      throw getEndpointError(WARN, 'Invalid email')
    }
    const user = await User.findOne({ email })
    if (!user) {
      throw getEndpointError(WARN, 'There is no such email in db')
    }

    if (user.passwordChangeToken) {

      if (!user.checkPasswordChangeTokenExpired(user.passwordChangeToken)) {
        throw getEndpointError(INFO, 'jwt not expired')
      }
    }

    const token = await user.generatePasswordResetToken()
    createEmail(res, user.email, "Reset hasła", 'passwordReset',
      { locale: 'pl', token: `http://${req.headers.host}/reset/${token}`, userName: user.name })

  } catch (e) {
    next(e)
  }
})

router.post("/validatePasswordChangeToken", async (req, res, next) => {
  const token = req.body.token
  try {
    if (!token) {
      throw getEndpointError(WARN, 'No token provided')
    }

    const user = await User.findByPasswordChangeToken(token)
    if (!user) {
      throw getEndpointError(WARN, 'User data error')
    }

    res.sendStatus(200)

  } catch (e) {
    next(e)
  }

})


router.patch('/reset', recaptcha, async (req, res, next) => {
  try {
    const token = req.body.token

    if (!token) {
      throw getEndpointError(WARN, 'No token provided')
    }
    if (req.body.password !== req.body.confirmPassword) {
      throw getEndpointError(WARN, 'Passwords do not match')
    }
    const user = await User.findByPasswordChangeToken(token)
    if (!user) {
      throw getEndpointError(WARN, 'User data error')
    }

    user.passwordChangeToken = null
    user.password = req.body.password

    await user.save()

    res.sendStatus(200)
  } catch (e) {
    next(e)
  }
})


router.post("/me/avatar", auth, async (req, res, next) => {
  try {
    if (!req.files) {
      throw getEndpointError(WARN, 'No file provided', req.user._id)
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
    if (!user.avatar) {
      throw getEndpointError(WARN, 'User has not got avatar', req.user._id)
    }

    await removeImage(uploadPath + user.avatar)
    user.avatar = null;
    await user.save();
    await user.standardPopulate();
    res.send(user);

  }
  catch (e) {
    next(e)
  }
});



router.patch("/party/equip", auth, async (req, res, next) => {
  try {

    const leader = req.user
    const itemId = req.body.id;

    if (!req.body.memberId) {
      throw getEndpointError(WARN, 'No memberId field', leader._id)
    }
    const party = await Party.findOne({ _id: leader.party, inShop: true, leader: leader._id, members: { $elemMatch: { $eq: req.body.memberId } } })

    if (!party) {
      throw getEndpointError(WARN, 'Invalid party conditions', leader._id)
    }

    if (leader.party.toString() !== party._id.toString()) {
      throw getEndpointError(WARN, 'Leader party field mismatch', leader._id)
    }

    const member = await User.findById(req.body.memberId)

    if (member.party.toString() !== party._id.toString()) {
      throw getEndpointError(WARN, 'Member party field mismatch', member._id)
    }

    const missionInstance = await MissionInstance.findOne(
      { party: { $elemMatch: { profile: member._id } } }
    )

    if (missionInstance) {
      throw getEndpointError(WARN, 'Cannot equip item during mission', leader._id)
    }

    const item = await Item.findOne({ _id: itemId, owner: req.body.memberId }).populate({
      path: 'itemModel',
      select: '_id type'
    })

    if (!item) {
      throw getEndpointError(WARN, 'Item not found or invalid owner prop', leader._id)
    }

    if (item.itemModel && item.itemModel.type !== 'scroll') {
      throw getEndpointError(WARN, 'Item to equip must be a scroll', leader._id)
    }

    const itemToEquip = member.bag.find(item => {
      return item.toString() === itemId;
    });

    if (!itemToEquip) {
      throw getEndpointError(WARN, 'Item does not exist', leader._id)
    }

    member.equipped.scroll = member.equipped.scroll ? null : itemId

    await member.updatePerks(true)

    await member.save();
    await member.standardPopulate()

    if (!member.party) {
      res.status(204).send(null)
      return
    }

    await member
      .populate({
        path: "party",
        populate: {
          path: "leader members", select: "_id name avatar attributes experience userPerks bag equipped class experience",
          populate: { path: "bag", populate: { path: "itemModel", populate: { path: "perks.target.disc-product", select: '_id name' }, } }
        }
      })
      .execPopulate();

    res.send(member.party);

  } catch (e) {
    next(e)
  }
});

router.patch("/items/equip", auth, async (req, res, next) => {
  try {

    const user = req.user;
    const itemId = req.body.id;
    const equipped = req.body.equipped;


    const missionInstance = await MissionInstance.findOne(
      { party: { $elemMatch: { profile: user._id } } }
    )

    if (missionInstance) {
      throw getEndpointError(WARN, 'Cannot equip item during mission', user._id)
    }

    //const party = await Party.findOne({inShop: true, members: {$elemMatch: {$eq: user._id}}})
    const party = await Party.findById(user.party) //even user.party is null

    //check if user is party member when party is in shop
    if (party && party.inShop && party.members.map((memberId) => memberId.toString()).includes(user._id.toString())) {
      throw getEndpointError(WARN, 'Cannot equip item during shopping', user._id)
    }


    const item = await Item.findOne({ _id: itemId, owner: user._id }).populate({
      path: 'itemModel',
      select: '_id type'
    })

    if (!item) {
      throw getEndpointError(WARN, 'Item not found or invalid owner prop', user._id)
    }

    //check if party inShop leader equip scroll item type 
    if (party && party.inShop) {
      if (item.itemModel && item.itemModel.type !== 'scroll') {
        throw getEndpointError(WARN, 'Item to equip must be a scroll', user._id)
      }
    }

    const itemToEquip = user.bag.find(item => {
      return item._id.toString() === itemId;
    });

    if (!itemToEquip) {
      throw getEndpointError(WARN, 'There is no such item in bag', user._id)
    }

    const checkEq = differenceBy(Object.values(equipped), user.bag, (item => item && item.toString()))
    if (checkEq.some(item => typeof item === 'string')) {
      throw getEndpointError(WARN, 'Equipped items do not match bag', user._id)
    }

    if (equipped.ringLeft && equipped.ringRight && equipped.ringLeft === equipped.ringRight) {
      throw getEndpointError(WARN, 'Duplicated ring want to be equipped', user._id)
    }

    if (equipped.weaponLeft && equipped.weaponRight && equipped.weaponLeft === equipped.weaponRight) {
      throw getEndpointError(WARN, 'Duplicated weapon want to be equipped', user._id)
    }

    if (equipped.weaponRight) {
      const weapon = await Item.findById(equipped.weaponRight).populate({
        path: 'itemModel',
        select: '_id twoHanded'
      })

      if (!weapon) {
        throw getEndpointError(WARN, 'Legacy weapon item id detected', user._id)
      }

      if (weapon.itemModel.twoHanded && equipped.weaponLeft) {
        throw getEndpointError(WARN, 'Detected additional weapon on second hand when twohanded weapon is equipped', user._id)
      }
    }

    if (equipped.weaponLeft) {
      const weapon = await Item.findById(equipped.weaponLeft).populate({
        path: 'itemModel',
        select: '_id twoHanded'
      })

      if (!weapon) {
        throw getEndpointError(WARN, 'Legacy weapon item id detected', user._id)
      }

      if (weapon.itemModel.twoHanded) {
        throw getEndpointError(WARN, 'Two handed weapon cannot be equipped on the second hand', user._id)
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

      if (user.equipped[slot] && user.equipped[slot].itemModel.type) {
        //exclude ringLeft, ringRight, weaponRight, weaponLeft
        const slotToType = slot.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').split('-')[0]

        if (user.equipped[slot].itemModel.type !== slotToType) {
          throw getEndpointError(WARN, 'Inapprioprate itemModel type in equipped object', user._id)
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
    next(e)
  }
});

router.delete("/items/remove", auth, async (req, res, next) => {
  const user = req.user
  try {
    const party = await Party.findOne({ _id: user.party, inShop: true })

    if (party) {
      throw getEndpointError(WARN, 'Cannot remove item when party is in shop', user._id)
    }

    const missionInstance = await MissionInstance.findOne(
      { party: { $elemMatch: { profile: user._id } } }
    )

    if (missionInstance) {
      throw getEndpointError(WARN, 'Cannot delete item during mission', user._id)
    }

    const item = await Item.findById({ _id: req.body.itemId });
    await item.remove();

    //Fetch updated user - bag and equipped changed
    const updatedUser = await User.findById(user._id)
    await updatedUser.standardPopulate();

    res.status(200).send(updatedUser);
  } catch (e) {
    e.status = e.status || 403
    next(e)
  }
});

router.patch('/confirmLevel', auth, async (req, res, next) => {
  const user = req.user
  const pointType = req.body.pointType

  try {
    if (user.levelNotifications <= 0) {
      throw getEndpointError(WARN, 'Operation forbidden', user._id)
    }

    if (!pointType) {
      throw getEndpointError(WARN, 'No point type field', user._id)
    }

    switch (pointType) {
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
        throw getEndpointError(WARN, 'Invalid point type field', user._id)
    }

    user.levelNotifications -= 1

    await user.save()
    await user.standardPopulate()
    res.send(user)
  } catch (e) {
    next(e)
  }
})



//OK
router.patch("/clearRallyAwards", auth, async (req, res, next) => {
  const user = req.user;

  try {
    if (!user.rallyNotifications.isNew) {
      throw getEndpointError(WARN, 'Operation forbidden', user._id)
    }

    user.rallyNotifications = { isNew: false, experience: 0, awards: [] };
    await user.save();
    await user.standardPopulate();
    res.send(user);
  } catch (e) {
    next(e)
  }
});

router.patch("/clearShopAwards", auth, async (req, res, next) => {
  const user = req.user;

  try {
    if (!user.shopNotifications.isNew) {
      throw getEndpointError(WARN, 'Operation forbidden', user._id)
    }

    user.shopNotifications = { isNew: false, experience: 0, awards: [] };
    await user.save();
    await user.standardPopulate();
    res.send(user);
  } catch (e) {
    next(e)
  }
});

const allFieldsTrue = loyal => {
  for (const field in loyal) {
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
        throw getEndpointError(WARN, 'Matching torpedo not found', user._id)
      }

      const item = await Item.findById(torpedo._id);

      if (!item) {
        throw getEndpointError(WARN, 'Item does not exist', user._id)
      }

      if (item.owner.toString() !== user._id.toString()) {
        throw getEndpointError(WARN, 'Owner field conflct', user._id)
      }

      resolve(item);
    } catch (e) {
      reject(e);
    }
  });
};

router.patch("/loyal", auth, async (req, res, next) => {
  const user = req.user;

  const fieldName = req.body.field;
  try {
    if (!user.bag.length) {
      throw getEndpointError(WARN, 'Bag is empty', user._id)
    }

    const item = await verifyTorpedo(user, fieldName);

    const fieldValue = user.loyal[fieldName];
    if (fieldValue === null || fieldValue === undefined) {
      throw getEndpointError(WARN, 'Field not found', user._id)
    }

    if (fieldValue === true) {
      throw getEndpointError(WARN, 'Field already shoted', user._id)
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
    next(e)
  }
});

router.get('/users', auth, async (req, res, next) => {
  try {
    const users = await User.aggregate().match({ active: true }).sort({ "experience": -1 }).project({
      '_id': 1,
      'avatar': 1,
      'name': 1,
      'experience': 1,
    })

    const userIndex = users.findIndex((user) => { //return client rank position
      return user._id.toString() === req.user._id.toString()
    })
    const slicedUsers = users.slice(0, 50) //return first 50 users

    res.send({ users: slicedUsers, userIndex })
  } catch (e) {
    next(e)
  }

})


///TESTS

router.patch("/addUserItem", adminAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    user.bag = [...user.bag, req.body.item];

    await user.save();
    res.send();
  } catch (e) {
    next(e)
  }
});

//WIP not working
router.get("/myItems", adminAuth, async (req, res, next) => {
  const user = req.user;

  try {
    await user.standardPopulate();

    const items = { bag: user.bag, equipped: user.equipped };
    res.send(items);
  } catch (error) {
    next(e)
  }
});

router.patch("/me", adminAuth, async (req, res, next) => {
  //TEST DEVELOP: get user from user id
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "password"];

  const isValidOperation = updates.every(update => {
    return allowedUpdates.includes(update);
  });

  try {
    if (!isValidOperation) {
      throw getEndpointError(WARN, 'Invalid update')
    }

    const id = req.body._id;

    let user = await User.findById(id);
    updates.forEach(async (update) => {
      if (update === "password") {

        user = await req.user.updatePassword(req.body.password.oldPassword, req.body.password.newPassword)
        //console.log(user)

      } else {
        user[update] = req.body[update]; //user[update] -> user.name, user.password itd.
      }
    });

    await user.save();

    res.send(user);
  } catch (e) {
    next(e)
  }
});

router.patch("/testUpdateUser", adminAuth, async (req, res, next) => {
  const user = req.user;

  try {
    await user.remove();
  } catch (e) {
    next(e)
  }
  res.send();
});

export const userRouter = router;
