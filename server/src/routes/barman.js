import express from "express";
import { Barman } from "@models/barman";
import { adminAuth } from "@middleware/adminAuth";
import { barmanAuth } from "@middleware/barmanAuth";
import { recaptcha } from "@middleware/recaptcha";
import { getEndpointError } from "@utils/functions";
import { ERROR, INFO, WARN } from '@utils/constants'

const router = express.Router();


router.get("/", adminAuth, async (req, res, next) => {
  try {

    const barmans = await Barman.find({})
    res.send(barmans)
  } catch (e) {
    next(e)
  }
})


router.post("/register", adminAuth, async (req, res, next) => {

  try {
    const barman = new Barman({
      userName: req.body.userName,
      password: req.body.password,
    });

    await barman.save()
    res.status(201).send(barman)

  } catch (e) { 
    next(e)
  }
});



router.post("/login", recaptcha, async (req, res, next) => {
  try {
    let barman = await Barman.findByCredentials(req.body.userName, req.body.password);
    const token = await barman.generateAuthToken(); //on instancegenerateAuthToken

    res
      .cookie("tokash", token, { maxAge: 2592000000, httpOnly: true })
      .send(barman); //cookie lifetime: 30 days (maxAge in msc)
  } catch (e) {
    next(e)
  }
});


router.get("/me", barmanAuth, async (req, res, next) => {
  try {
    res.send(req.barman);
  } catch (e) {
    next(e)
  }
});

router.post("/logout", barmanAuth, async (req, res, next) => {
  try {
    req.barman.token = null

    await req.barman.save();

    res.clearCookie("token").send();
  } catch (e) {
    next(e)
  }
});

router.patch("/changePasswordAdmin", adminAuth, async (req, res, next) => {
  try {
    const barman = await Barman.findById(req.body._id)
    barman.password = req.body.password
    await barman.save()
    res.sendStatus(200)
  } catch (e) {
    next(e)
  }
});

router.patch("/changePassword", barmanAuth, async (req, res, next) => {
  let barman = req.barman;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.password;
  const repeatedNewPassword = req.body.confirmPassword

  try {
    if (oldPassword === newPassword) {
      throw getEndpointError(WARN, 'New and old password cannot be the same', req.barman._id)
    }
    if (newPassword !== repeatedNewPassword) {
      throw getEndpointError(WARN, 'Passwords do not match', req.barman._id)
    }
    barman = await req.barman.updatePassword(oldPassword, newPassword);
    await barman.save();
    res.status(200).send(barman);
  } catch (e) {  
    next(e)
  }
});


router.delete("/delete", adminAuth, async (req, res, next) => {
  try {
    await Barman.findOneAndDelete({ _id: req.body._id })

    res.status(200).send();
  } catch (e) {
    next(e)
  }
});

export const barmanRouter = router