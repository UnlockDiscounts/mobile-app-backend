import Feedback from "../models/feedback.model.js";

export const createFeedback = async (req, res) => {
  try {
    const { rating } = req.body;
    const customerId = req.user?._id
    const providerId = req.params?.providerId
    console.log(customerId)

    if (!customerId) {
      return res.status(400).json({ message: "user is not logged in" });
    }

    if(!providerId)
    {
      return res.status(400).json({ message: "providerId is required" });
    }
    const feedback = await Feedback.create({
      customer: customerId,
      provider: providerId,

      rating,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully.",
      feedback,
    });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit feedback.",
      error: error.message,
    });
  }
};


export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("provider", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedbacks.",
      error: error.message,
    });
  }
};


export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback)
      return res.status(404).json({ message: "Feedback not found." });

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete feedback.",
      error: error.message,
    });
  }
};

export const getProviderAverageRating = async (req, res) => {
  try {
    const { providerId } = req.params;
    const feedbacks = await Feedback.find({ user: providerId });
    if (feedbacks.length === 0) {
      return res.status(200).json({ averageRating: 0, count: 0 });
    }
    const totalRating = feedbacks.reduce((sum, fb) => sum + fb.rating, 0);
    const averageRating = totalRating / feedbacks.length;
    res.status(200).json({ averageRating, count: feedbacks.length });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch average rating.",
      error: error.message,
    });
  }
};
