import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from "cors";
const app = express();
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


app.use(cors({
  origin: true,
  credentials: true,
}));


import authRoutes from "./routes/auth.route.js";
import providerRoute from "./routes/serviceProvider.route.js";
import feedbackRoute from "./routes/feedback.route.js"
import emailRoutes from "./routes/email.route.js"
import bookingRoute from "./routes/booking.route.js"
app.use("/api/auth", authRoutes);
app.use('/api/provider', providerRoute);
app.use('/api/feedback', feedbackRoute);
app.use('/api/email',emailRoutes)
app.use('/api/booking',bookingRoute);
app.get("/", (req, res) => {
  res.send("UnlockDiscounts API is Live");
});

export default app;