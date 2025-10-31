import express from "express";
import { requestEmailOtp, verifyEmailOtp } from "../controllers/email.controller.js";

const router = express.Router();

router.post("/request-otp", requestEmailOtp);
router.post("/verify-otp", verifyEmailOtp);


export default router;
