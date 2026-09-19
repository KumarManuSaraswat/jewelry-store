import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  markOrderAsPaid,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

router.post("/:id/create-razorpay-order", protect, createRazorpayOrder);
router.post("/:id/verify-razorpay-payment", protect, verifyRazorpayPayment);

router.put("/:id/pay", protect, adminOnly, markOrderAsPaid);

router.get("/", protect, adminOnly, getAllOrdersAdmin);
router.put("/:id/status", protect, adminOnly, updateOrderStatusAdmin);

export default router;
