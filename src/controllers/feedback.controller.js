import Feedback from "../models/feedback.model.js";

export const submitFeedback = async (req, res) => {
  try {
    const { bookingId, providerId, userEmail, stars, review } = req.body;

    // validate required fields
    if (!bookingId || !providerId || !userEmail || !stars) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // create feedback record, including providerId
    const feedback = await Feedback.create({
      bookingId,
      providerId,
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
    console.error("submitFeedback error:", err);
    res.status(500).json({ message: err.message });
  }
};
