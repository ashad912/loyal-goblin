import express from "express";
import { Barman } from "../models/barman";
import { adminAuth } from "../middleware/adminAuth";
import { barmanAuth } from "../middleware/barmanAuth";

const router = express.Router();


router.get("/", adminAuth, async (req, res) => {
  try {
    
    const barmans = await Barman.find({})
    res.send(barmans)
  } catch (error) {
    res.status(400).send(error)
  }
})


router.post("/register", adminAuth, async (req, res) => {

    try {
      const barman = new Barman({
        userName: req.body.userName,
        password: req.body.password,
});
    
      await barman.save()
        res.status(201).send(barman)

    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  });
 

  
router.post("/login", async (req, res) => {
  try {
    let barman = await Barman.findByCredentials(req.body.email, req.body.password);
    const token = await barman.generateAuthToken(); //on instancegenerateAuthToken
    
    res
      .cookie("token", token, { maxAge: 2592000000, httpOnly: true })
      .send(barman); //cookie lifetime: 30 days (maxAge in msc)
  } catch (e) {
    res.status(400).send(e);
  }
});


router.get("/me", barmanAuth, async (req, res, next) => {
  try {
    res.send(req.barman);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/logout", barmanAuth, async (req, res) => {
  try {
    req.barman.token = null

    await req.barman.save();

    res.clearCookie("token").send();
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/changePasswordAdmin", adminAuth, async (req, res, next) => {
  try {
    const barman = await Barman.findById(req.body._id)
    barman.password = req.body.password
    await barman.save()
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    res.status(400).send()
  }
});

router.patch("/changePassword", barmanAuth, async (req, res, next) => {
  let barman = req.barman;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.password;
  const repeatedNewPassword = req.body.confirmPassword
 
  try {
    if (oldPassword === newPassword) {
      throw new Error("Nowe i stare hasła nie mogą być takie same");
    } 
    if(newPassword !== repeatedNewPassword){
      throw new Error("Hasła nie zgadzają się")
    }
      barman = await req.barman.updatePassword(oldPassword, newPassword);
      await barman.save();
      res.status(200).send(barman);
    } catch (e) {
      console.log(e)
      res.status(400).send(e);
    }
  });


  router.delete("/delete", adminAuth, async (req, res) => {
    try {
      await Barman.findOneAndDelete({_id: req.body._id})
  
      res.status(200).send();
    } catch (e) {
      console.log(e)
      res.status(500).send();
    }
  });

export const barmanRouter = router