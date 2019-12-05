import express from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import sharp from "sharp";
import { User } from "../models/user";
import { Item } from "../models/item";
import { auth } from "../middleware/auth";
import { asyncForEach, designateUserPerks, userPopulateBag, updatePerks } from "../utils/methods";
import moment from "moment";
import { resolve } from "url";

const router = express.Router();

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
  req.body.perksUpdatedAt = moment().toISOString()
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
    let user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken(); //on instancegenerateAuthToken
    user = await userPopulateBag(user)
    res.cookie("token", token, { httpOnly: true }).send(user);
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
router.patch('/updatePerks', auth, async (req, res, next) => {

  const user = req.user

  try{
      user.userPerks = await updatePerks(user, true)

      res.send(user.userPerks)
  }catch(e){
      res.status(400).send(e.message)
  }
})


router.get("/me", auth, async (req, res, next) => {
  try {
    const user = await userPopulateBag(req.user)
    
    user.userPerks = await updatePerks(user, false)

    res.send(user);
  } catch (e) {
    res.status(400).send(e.message)
  }
});

router.patch("/me", auth, async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "password"];

  const isValidOperation = updates.every(update => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid update!" });
  }

  try {
    const user = req.user;

    updates.forEach(update => {
      user[update] = req.body[update]; //user[update] -> user.name, user.password itd.
    });

    await user.save();

    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

const upload = multer({
  //dest: 'public/avatars',
  limits: {
    fileSize: 10485760
  },
  fileFilter(req, file, cb) {
    //cb means callback

    if (!file.originalname.match(/\.(jpg|jpeg|png|bmp)$/)) {
      return cb(new Error("Please upload an image."));
    }

    cb(undefined, true);
  }
});

router.post(
  "/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    //to have access to file here, we have to delete 'dest' prop from multer
    //req.ninja.avatar = req.file.buffer //saved in binary data- base64 - it's possible to render img from binary
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 100, height: 100 })
      .png()
      .toBuffer(); //convert provided img to png and specific size
    req.user.avatar = buffer;

    await req.user.save();
    res.send(req.user);
  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message }); //before app.use middleware with 422
  }
);

router.delete(
  "/me/avatar",
  auth,
  async (req, res) => {
    req.user.avatar = undefined;

    await req.user.save();
    res.send(req.user);
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


router.delete('/deleteUserItem', auth, async (req, res) => {
  try {
      const item = await Item.findById({_id: req.body.id})
      await item.remove()
      let user = await User.findById({_id: req.user._id})
      user = await userPopulateBag(user)
      res.status(200).send(user)
      
  } catch (error) {
      console.log(error)
      res.status(403).send(error)
  }
})

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
    user = await userPopulateBag(user)

    const items = { bag: user.bag, equipped: user.equipped };
    res.send(items);
  } catch (error) {
    res.status(400).send();
  }
});

router.patch("/myItems/equip", auth, async (req, res) => {
  let user = req.user;
  const itemId = req.body.id;
  const category = req.body.category;

  const equipped = req.body.equipped;
  try {
    const itemToEquip = user.bag.find(item => {
      return item.toString() === itemId;
    });
   
    
    if(itemToEquip){
      user.equipped = {...equipped}
      user.userPerks = await designateUserPerks(user)
      await user.save();
      user = await userPopulateBag(user)
      //Depopulate equipped key
      user.equipped = {...equipped}
      res.status(200).send(user);
    }else{
     // console.log("item not found")
      res.sendStatus(400)
    }
  } catch (error) {
    console.log(error)
    res.sendStatus(400)
  }
})


  
  router.patch('/testUpdateUser', auth, async(req, res) => {
    const user = req.user

    
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
    try{await user.remove()}catch(e){res.status(400).send(e.message)}
    res.send()

    // missionInstance.remove()
    
})
  
  

export const userRouter = router;
