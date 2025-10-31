import crypto from "crypto";
import Otp from "../models/otp.model.js";
import { generateOTP, hashOTP, expiryMinutesFromNow } from "../utils/otp.js";
import { createTransporter, sendEmail } from "../services/emailService.js";
export const requestEmailOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const otp = generateOTP(6);
  const salt = crypto.randomBytes(8).toString("hex");
  const otpHash = hashOTP(otp, salt);
  const expiresAt = expiryMinutesFromNow(5);

  await Otp.findOneAndUpdate(
    { identifier: email, purpose: "email_auth" },
    { otpHash, salt, expiresAt, attempts: 0 },
    { upsert: true, new: true }
  );

  const transporter = createTransporter(); 
  const info = await sendEmail(transporter, {
    to: email,
    subject: "Your OTP",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`
  });

  return res.json({ ok: true, info });
} 


export const verifyEmailOtp = async (req, res) => {

  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: "Missing fields" });

  const record = await Otp.findOne({ identifier: email, purpose: "email_auth" });
  if (!record) return res.status(400).json({ error: "No OTP requested" });

  if (new Date() > record.expiresAt) {
    await Otp.deleteOne({ _id: record._id });
    return res.status(400).json({ error: "OTP expired" });
  }

  record.attempts += 1;
  if (record.attempts > 5) {
    await Otp.deleteOne({ _id: record._id });
    return res.status(429).json({ error: "Too many attempts" });
  }
  await record.save();

  const candidateHash = hashOTP(otp, record.salt);
  if (candidateHash !== record.otpHash) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  await Otp.deleteOne({ _id: record._id });
  return res.json({ ok: true, message: "OTP verified successfully" });

};