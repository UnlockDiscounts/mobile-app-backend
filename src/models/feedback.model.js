import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider", // should match your service provider model name
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    stars: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    review: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

feedbackSchema.index({ providerId: 1 }); // helps when fetching feedbacks per provider

export default mongoose.model("Feedback", feedbackSchema);
