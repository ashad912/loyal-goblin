import express from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import sharp from "sharp";
import { User } from "../models/user";
import { auth } from "../middleware/auth";

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
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken(); //on instancegenerateAuthToken
    const uid = user._id;
    res.cookie("token", token, { httpOnly: true }).send(uid);
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

router.get("/me", auth, (req, res, next) => {
  res.send(req.user);
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
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer(); //convert provided img to png and specific size
    req.user.avatar = buffer;

    await req.user.save();
    res.send();
  },
  (err, req, res, next) => {
    res.status(400).send({ error: err.message }); //before app.use middleware with 422
  }
);

//WIP
//Nie wiem kiedy i jak i czy są tu te populejty
router.get("/me/myItems", auth, async (req, res) => {
  const items = { bag: req.user.bag, equipped: req.user.equipped };
  res.send(items);
});

router.patch("/me/myItems/equip/", auth, async (req, res) => {
  const user = req.user;
  const itemId = req.body.itemId;
  const itemCategory = req.body.itemCategory;
  //Store item in const
  const itemToEquip = user.bag[itemCategory].find(item => {
    item._id === itemId;
  });
  //Remove item from bag
  user.bag = user.bag[itemCategory].filter(item => {
    item._id !== itemId;
  });
  user.equipped[itemCategory] = itemToEquip;
  await user.save();
  res.sendStatus(200);
});

export const userRouter = router;
