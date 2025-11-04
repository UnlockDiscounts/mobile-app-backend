import express from "express";
import { createBooking, getBookingsByEmail } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/create", createBooking);

router.get("/user/:email", getBookingsByEmail);

export default router;
