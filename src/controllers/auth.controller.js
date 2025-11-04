import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { generateTokens } from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { email, password, address } = req.body;

    if (!email || !password ) {
      return res.status(400).json({ message: "Email, password and phone number are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = await User.create({
      email,
      password,
      address
    });

    const { accessToken, refreshToken } = generateTokens(newUser);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        email: newUser.email      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = generateTokens(user);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};


export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const newAccessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};


export const verifyOtp = async (req, res) => {
  const { idToken } = req.body; 

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);

    const { accessToken, refreshToken } = generateTokens(user);

    res.status(200).json({
      success: true,
      message: "OTP Verified Successfully",
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(401).json({ message: "Invalid or expired OTP token" });
  }
};