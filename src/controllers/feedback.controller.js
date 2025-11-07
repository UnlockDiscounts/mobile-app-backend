import Feedback from "../models/feedback.model.js";

export const submitFeedback = async (req, res) => {
  try {
    console.log(req)
    const { bookingId, userEmail, stars, review } = req.body;

    if (!bookingId  || !userEmail || !stars) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const feedback = await Feedback.create({
      bookingId,
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

export const getProviderFeedback = async (req, res) => {
  try {
    const { providerId } = req.params;
    const feedbacks = await Feedback.find({ providerId });
    res.json({ success: true, feedbacks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
