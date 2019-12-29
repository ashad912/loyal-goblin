import express from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import sharp from "sharp";
import fs from 'fs'
import validator from 'validator'

import { User } from "../models/user";
import { Item } from "../models/item";
import { ItemModel } from "../models/itemModel";
import { auth } from "../middleware/auth";
import {
  asyncForEach,
  designateUserPerks,
  userPopulateBag,
  updatePerks
} from "../utils/methods";
import moment from "moment";
import { resolve } from "url";
import createEmail from '../emails/createEmail'

const router = express.Router();

const uploadPath = "../client/public/images/user_uploads/"

router.post("/create", async (req, res) => {
  //registerKey used in biometrica, hwvr we may allow registration for ppl with key from qrcode - i left it

  if (!req.body.registerKey) {
    res.status(400).send();
  }

  const isMatch = await bcrypt.compare(
    req.body.registerKey,
    process.env.REGISTER_KEY
  );

  if (!isMatch) {
    res.status(401).send({ error: "Please authenticate." });
  }

  delete req.body.registerKey;
  req.body.perksUpdatedAt = moment().toISOString();
  const user = new User(req.body);

  try {
    await user.save(); //this method holds updated user!
    res.status(201).send({ user });
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

router.post("/login", async (req, res) => {
  try {
    let user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken(); //on instancegenerateAuthToken
    user = await userPopulateBag(user);
    user.userPerks = await updatePerks(user, true);
    if(user.passwordChangeToken){
      user.passwordChangeToken = null
      await user.save()
    }
    res
      .cookie("token", token, { maxAge: 2592000000, httpOnly: true })
      .send(user); //cookie lifetime: 30 days (maxAge in msc)
  } catch (e) {
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
    user.userPerks = await updatePerks(user, true);

    res.send(user.userPerks);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.get("/me", auth, async (req, res, next) => {
  try {
    const user = await userPopulateBag(req.user);

    user.userPerks = await updatePerks(user, false);

    if(user.passwordChangeToken){
      user.passwordChangeToken = null
      await user.save()
    }
    if(user.party){
      await user.populate({
        path: "party"
      });
    }

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


    res.send(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// router.patch("/me", auth, async (req, res, next) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = ["name", "password"];

//   const isValidOperation = updates.every(update => {
//     return allowedUpdates.includes(update);
//   });

//   if (!isValidOperation) {
//     return res.status(400).send({ error: "Invalid update!" });
//   }

//   try {
//     let user = req.user;
//     updates.forEach(async (update) => {
//       if(update === "password"){

//           user = await req.user.updatePassword(req.body.password.oldPassword, req.body.password.newPassword)
// console.log(user)

//       }else{
//         user[update] = req.body[update]; //user[update] -> user.name, user.password itd.
//       }
//     });

//     await user.save();

//     res.send(user);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

router.patch("/changePassword", auth, async (req, res, next) => {
  let user = req.user;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.password;
  const repeatedNewPassword = req.body.confirmPassword
  console.log(oldPassword, newPassword, repeatedNewPassword)
  try {
    if (oldPassword === newPassword) {
      throw new Error("Nowe i stare hasła nie mogą być takie same");
    } 
    if(newPassword !== repeatedNewPassword){
      throw new Error("Hasła nie zgadzają się")
    }
      user = await req.user.updatePassword(oldPassword, newPassword);
      await user.save();
      res.send(user);
    } catch (e) {
      res.status(400).send(e);
    }
  });

// const upload = multer({
//   //dest: 'public/avatars',
//   limits: {
//     fileSize: 10485760
//   },
//   fileFilter(req, file, cb) {
//     //cb means callback

//     if (!file.originalname.match(/\.(jpg|jpeg|png|bmp)$/)) {
//       return cb(new Error("Please upload an image."));
//     }

//     cb(undefined, true);
//   }
// });

router.post("/forgotPassword", async (req, res) => {
  try {
    
    const email = req.body.email
    if(!validator.isEmail(email)){
      throw new Error("Nieprawidłowy adres email")
    }
    const user = await User.findOne({email})
    if(!user){
      throw new Error("Podany adres email nie widnieje w bazie")
    }

    if(user.passwordChangeToken){
      
      if(!user.checkPasswordChangeTokenExpired(user.passwordChangeToken)){
        console.log('here')
        throw new Error("jwt not expired")
      }
    }

    const token = await user.generatePasswordResetToken()
    createEmail(res, user.email, "Reset hasła", 'passwordReset',
    { locale: 'pl', token: `http://${req.headers.host}/reset/${token}`, userName: user.name })

  } catch (error) {
    console.log(error)
    res.status(400).send(error.message)
  }
})

router.post("/validatePasswordChangeToken", async(req, res) => {
  const token = req.body.token
  try {
    if (!token) {
        throw new Error("Brak tokena resetu hasła")
    }
  
    const user = await User.findByPasswordChangeToken(token)
    if(!user){
      throw new Error("Błąd danych użytkownika")
    }

    res.sendStatus(200)
    
  } catch (e) {
    console.log(e)

    res.status(401).send(e.message)
  }
  
})


router.patch('/reset', async (req, res) => {
  try {
    const token = req.body.token
    if (!token) {
        throw new Error("Brak tokena resetu hasła")
    }
    if(req.body.password !== req.body.confirmPassword){
      throw new Error("Hasła się nie zgadzają")
    }
      const user = await User.findByPasswordChangeToken(token)
      if (!user) {
        throw new Error('Nie znaleziono użytkownika')
      }
      user.passwordChangeToken = null
      user.password = req.body.password

          user.save()
          res.sendStatus(200)
      } 
   catch (error) {
      console.log(error)
      res.status(400).send(error)
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

router.post("/me/avatar", auth, async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: "Brak pliku"
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let avatar = req.files.avatar;

      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      
      const avatarName = req.user._id + Date.now() + ".jpg"
      //avatar.mv("../client/public/images/user_uploads/" + avatar.name);
      sharp(avatar.tempFilePath)
        .resize({ width: 124 })
        .toFile(uploadPath + avatarName)
        .then(function(newFileInfo) {
          //console.log("Success");
        })
        .catch(function(err) {
          console.log(err);
        });
        if(req.user.avatar){
          fs.unlink(uploadPath+req.user.avatar, async function (err) {
            if (err) throw err;
            console.log('File deleted!');
            req.user.avatar = avatarName;
            let user = await req.user.save();
            user = await userPopulateBag(user);
            res.send(user);
          });
        }else{
          req.user.avatar = avatarName;
          let user = await req.user.save();
          user = await userPopulateBag(user);
          res.send(user);
        }

    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/me/avatar", auth, async (req, res) => {
    if(req.user.avatar){
      fs.unlink(uploadPath+req.user.avatar, async function (err) {
        if (err) throw err;
        console.log('File deleted!');
        req.user.avatar = null;
        await req.user.save();
        const user = await userPopulateBag(req.user);
        res.send(user);
      });
    }

  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message }); //before app.use middleware with 422
  }
);

router.patch("/addUserItem", auth, async (req, res) => {
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

router.delete("/deleteUserItem", auth, async (req, res) => {
  try {
    const item = await Item.findById({ _id: req.body.id });
    await item.remove();
    let user = await User.findById({ _id: req.user._id });
    user = await userPopulateBag(user);
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(403).send(error);
  }
});

// router.patch("/deleteUserItem", auth, async (req, res) => {
//   try {
//     const user = req.user

//     user.bag = user.bag.filter(item => {
//       return item.toString() !== req.body.item;
//     });

//     await user.save();
//     res.send();
//   } catch (e) {
//     console.log(e.message);
//     res.status(400).send();
//   }
// });

//WIP not working
router.get("/myItems", auth, async (req, res) => {
  let user = req.user;

  try {
    user = await userPopulateBag(user);

    const items = { bag: user.bag, equipped: user.equipped };
    res.send(items);
  } catch (error) {
    res.status(400).send();
  }
});

router.patch("/myItems/equip", auth, async (req, res) => {

  let user = req.user;
  if(req.body.memberId){
    user = await User.findById(req.body.memberId)
  }
  console.log(user)
  const itemId = req.body.id;
  const category = req.body.category;

  const equipped = req.body.equipped;
  
  try {
    const itemToEquip = user.bag.find(item => {
      return item.toString() === itemId;
    });

    if (itemToEquip) {
      user.equipped = { ...equipped };
      user.userPerks = await designateUserPerks(user);
      user.userPerks = await updatePerks(user, true);
      await user.save();
      user = await userPopulateBag(user);
      //Depopulate equipped key
      user.equipped = { ...equipped };

      if(req.body.memberId){
        
          if(!user.party){
            res.status(204).send(null)
            return
          }
          
          await user
            .populate({
              path: "party",
              populate: { path: "leader members", select: "_id name avatar attributes experience userPerks bag equipped", 
            populate: { path: "bag", populate: { path: "itemModel" } } }
            })
            .execPopulate();
      
          res.send(user.party);
          
        
      }else{
        res.status(200).send(user);

      }

    } else {
      // console.log("item not found")
      res.sendStatus(400);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

//CHECK
router.patch("/clearAwards", auth, async (req, res) => {
  let user = req.user;

  try {
    user.newRallyAwards = [];
    await user.save();
    user = await userPopulateBag(user);
    res.send(user);
  } catch (e) {
    res.status(500).send(e.message);
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
          populate: { path: "itemModel" }
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

    await item.remove(); //user bag and equipped cleared by remove middleware

    let updatedUser = await User.findById(user._id);
    //updated by item removing middleware -> have to pass to resposne 'fresh' object
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
            path: "itemModel"
          })
          .execPopulate();

        awardToPass = newItem;
      }

      Object.keys(updatedUser.loyal.toJSON()).forEach(key => {
        updatedUser.loyal[key] = false; //IMPORTANT: overwriting keys!! important .toJSON() to not overwrite 'mongo keys'
      });
    }

    await updatedUser.save();

    updatedUser = await userPopulateBag(updatedUser);

    res.send({ updatedUser, awardToPass });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.patch("/testUpdateUser", auth, async (req, res) => {
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
