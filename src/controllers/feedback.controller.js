import Feedback from "../models/feedback.model.js";

export const submitFeedback = async (req, res) => {
  try {
    const { bookingId, providerId, userEmail, stars, review } = req.body;

    if (!bookingId || !providerId || !userEmail || !stars) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const feedback = await Feedback.create({
      bookingId,
      providerId,
      userEmail,
      stars,
      review,
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully!",
      feedback,
    });
  } catch (err) {
    console.error("submitFeedback error:", err);
    return res.status(500).json({ message: err.message });
  }
};

export const getProviderFeedback = async (req, res) => {
  try {
    const { providerId } = req.params;
    const feedbacks = await Feedback.find({ providerId }).sort({ createdAt: -1 });
    return res.json({ success: true, feedbacks });
  } catch (err) {
    console.error("getProviderFeedback error:", err);
    return res.status(500).json({ message: err.message });
  }
};
