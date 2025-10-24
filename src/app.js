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
app.get("/", (req, res) => {
  res.send("UnlockDiscounts API is Live");
});

export default app;