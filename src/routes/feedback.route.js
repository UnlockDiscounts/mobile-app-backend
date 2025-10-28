import express from 'express'
import { createFeedback, deleteFeedback, getAllFeedbacks,getProviderAverageRating } from '../controllers/feedback.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
const router = express.Router();
router.post("/:providerId",verifyToken, createFeedback);
router.get("/averagefeedback/:providerId", getProviderAverageRating);
router.delete("/:id",verifyToken, deleteFeedback);

export default router;
