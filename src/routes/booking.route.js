import express from "express";
import { createBooking, getBookingsByEmail, getRecentBookingsByProvider } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/create", createBooking);

router.get("/user/:email", getBookingsByEmail);
router.get("/recent", getRecentBookingsByProvider);
export default router;
