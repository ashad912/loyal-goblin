import express from "express";
import { Admin } from "@models/admin";
import { adminAuth } from "@middleware/adminAuth";
import {recaptcha} from '@middleware/recaptcha'

const router = express.Router();

router.post("/login", recaptcha, async (req, res) => {
  try {
    const admin = await Admin.findByCredentials(req.body.email, req.body.password);
    const token = await admin.generateAuthToken(); //on instancegenerateAuthToken
    res.cookie("hash", token, { maxAge: 43200000, httpOnly: true }).send(admin); //cookie lifetime: 12 hours (maxAge in msc)
  } catch (e) {
    next(e)
  }
});

router.get("/me", adminAuth, async (req, res, next) => {
  try {
    res.send(req.admin);
  } catch (e) {
    next(e)
  }
});

router.post("/logout", adminAuth, async (req, res) => {
  try {
    req.admin.token = null
    await req.admin.save();

    res.clearCookie("hash").send();
  } catch (e) {
    next(e)
  }
});


export const adminRouter = router;