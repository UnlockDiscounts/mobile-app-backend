import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  identifier: { type: String, required: true }, 
  otpHash: { type: String, required: true },
  salt: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 }, 
  purpose: { type: String, default: "auth" } 
}, { timestamps: true });
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Otp", OtpSchema);