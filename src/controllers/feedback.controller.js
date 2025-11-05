import Feedback from "../models/feedback.model.js";

export const submitFeedback = async (req, res) => {
  try {
    const { bookingId, providerId, userEmail, stars, review } = req.body;

    if (!bookingId || !providerId || !userEmail || !stars) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const feedback = await Feedback.create({
      bookingId,
      providerId,  // store provider id
      userEmail,
      stars,
      review,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully!",
      feedback,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
