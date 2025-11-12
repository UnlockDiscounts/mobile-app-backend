import Booking from "../models/booking.model.js";

// ✅ CREATE a new booking
export const createBooking = async (req, res) => {
  try {
    const {
      fullName,
      email,
      address,
      businessName,
      providerName,
      category,
      service,
      price,
      date,
    } = req.body;

    // validation
    if (!fullName || !email || !businessName || !providerName || !category || !service || !price) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    const newBooking = new Booking({
      fullName,
      email,
      address,
      businessName,
      providerName,
      category,
      service,
      price,
      date,
    });

    const savedBooking = await newBooking.save();
    return res.status(201).json({
      message: "Booking created successfully!",
      booking: savedBooking,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ GET all bookings by email
export const getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const bookings = await Booking.find({ email }).sort({ createdAt: -1 });

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found for this email." });
    }

    return res.status(200).json({
      message: "Bookings fetched successfully.",
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getRecentBookingsByProvider = async (req, res) => {
  try {
    const { businessName, providerName } = req.query;

    if (!businessName || !providerName) {
      return res.status(400).json({
        success: false,
        message: "Both businessName and providerName are required",
      });
    }

    // Find recent bookings for that provider
    const recentBookings = await Booking.find({
      businessName,
      providerName,
    })
      .sort({ createdAt: -1 }) // recent first
      .limit(5); // latest 5 bookings (you can change it)

    if (recentBookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings found for this provider",
      });
    }

    res.status(200).json({
      success: true,
      count: recentBookings.length,
      data: recentBookings,
    });
  } catch (error) {
    console.error("Error fetching recent bookings by provider:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching bookings",
    });
  }
};