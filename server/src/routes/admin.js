import express from "express";
import { body, validationResult } from 'express-validator'

import adminService from "@services/admin";
import { adminAuth } from "@middleware/adminAuth";
import { recaptcha } from '@middleware/recaptcha'

import { ERROR, WARN, INFO } from '@utils/constants'
import { getEndpointError } from "@utils/functions";

const router = express.Router();

router.post("/login", [
  body('email')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 15 })
    .withMessage('Password must have at least 15 characters')
],
  recaptcha,
  async (req, res, next) => {
    try {
      const errors = validationResult(req) // Kinda Object

      if (!errors.isEmpty()) {
        throw getEndpointError(WARN, `Validation error: ${JSON.stringify(errors.array())}`)
      }

      const { admin, token } = await adminService.login(req.body.email, req.body.password)
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

router.post("/logout", adminAuth, async (req, res, next) => {
  try {
    await adminService.logout(req.admin)
    res.clearCookie("hash").send();
  } catch (e) {
    next(e)
  }
});


export { router as adminRouter };