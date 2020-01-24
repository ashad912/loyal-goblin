import express from "express";
import { Admin } from "../models/admin";
import { adminAuth } from "../middleware/adminAuth";

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
      let admin = await Admin.findByCredentials(req.body.email, req.body.password);
      const token = await admin.generateAuthToken(); //on instancegenerateAuthToken
      res.cookie("hash", token, { maxAge: 43200000, httpOnly: true }).send(admin); //cookie lifetime: 12 hours (maxAge in msc)
    } catch (e) {
      res.status(400).send(e.message);
    }
  });
  
router.post("/logout", adminAuth, async (req, res) => {
    try {
        req.admin.token = null
        await req.admin.save();

        res.clearCookie("hash").send();
    } catch (e) {
        res.status(400).send(e.message);
}
});
  

export const adminRouter = router;