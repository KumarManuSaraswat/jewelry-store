import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { rateLimit } from "./middleware/rateLimit.js";
import { paymentWebhook } from "./controllers/paymentWebhook.js";
const app = express();
app.disable("x-powered-by");
if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://orniva.netlify.app",
  ...(process.env.CLIENT_URL || "").split(","),
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) =>
      callback(null, !origin || allowedOrigins.includes(origin)),
    credentials: true,
  }),
);
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Cache-Control", "no-store");
  next();
});
app.post(
  "/api/payments/razorpay/webhook",
  express.raw({ type: "application/json", limit: "256kb" }),
  paymentWebhook,
);
app.get("/api/store/config", (req, res) =>
  res.json({
    onlinePayment:
      process.env.ENABLE_ONLINE_PAYMENTS === "true" &&
      !!process.env.RAZORPAY_KEY_ID &&
      !!process.env.RAZORPAY_KEY_SECRET &&
      !!process.env.RAZORPAY_WEBHOOK_SECRET,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use(cookieParser());
app.get("/", (req, res) => res.json({ service: "Orniva API" }));
app.get("/api/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res
    .status(connected ? 200 : 503)
    .json({ status: connected ? "ready" : "database unavailable" });
});
app.use("/api/auth", rateLimit());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use((req, res) => res.status(404).json({ message: "Route not found." }));
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  res.status(error.status || 400).json({
    message:
      error.code === "LIMIT_FILE_SIZE"
        ? "Images must be smaller than 5 MB."
        : "Unable to process this request. Please check your details.",
  });
});
export default app;
