import Feedback from "../models/feedback.model.js";
import Booking from "../models/booking.model.js";

/**
 * @desc Submit feedback for a booking
 * @route POST /api/feedback
 */
export const submitFeedback = async (req, res) => {
  try {
    const { bookingId, providerId, userEmail, stars, review } = req.body;

    if (!bookingId || !providerId || !userEmail || !stars) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Prevent duplicate feedback for the same booking
    const existingFeedback = await Feedback.findOne({ bookingId });
    if (existingFeedback) {
      return res.status(400).json({ message: "Feedback already submitted for this booking" });
    }

    // Create new feedback
    const feedback = await Feedback.create({
      bookingId,
      providerId,
      userEmail,
      stars,
      review,
    });

    res.status(201).json({
      message: "Feedback submitted successfully!",
      feedback,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Get feedback for a provider
 * @route GET /api/feedback/:providerId
 */
export const getProviderFeedback = async (req, res) => {
  try {
    const { providerId } = req.params;

    const feedbacks = await Feedback.find({ providerId }).sort({ createdAt: -1 });

    if (!feedbacks || feedbacks.length === 0) {
      return res.status(404).json({ message: "No feedback found for this provider" });
    }

    res.status(200).json({
      message: "Feedback fetched successfully",
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    console.error("Error fetching provider feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
