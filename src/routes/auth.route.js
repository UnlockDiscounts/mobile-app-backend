import express from "express";
import {signup,login,refreshAccessToken, verifyOtp} from "../controllers/auth.controller.js"

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
router.post("/verify-otp", verifyOtp);
export default router;