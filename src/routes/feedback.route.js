import express from "express";
import { submitFeedback, getProviderFeedback } from "../controllers/feedback.controller.js";

const router = express.Router();

router.post("/", submitFeedback);
router.get("/:providerId", getProviderFeedback);

export default router;
