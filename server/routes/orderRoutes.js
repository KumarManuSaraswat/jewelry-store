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
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/pay", protect, markOrderAsPaid);

router.get("/", protect, adminOnly, getAllOrdersAdmin);
router.put("/:id/status", protect, adminOnly, updateOrderStatusAdmin);

export default router;