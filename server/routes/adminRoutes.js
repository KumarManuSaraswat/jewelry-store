import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import {
  getAdminStats,
  getAllUsersForAdmin,
  updateUserRole,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, getAdminStats);
router.get("/users", protect, adminOnly, getAllUsersForAdmin);
router.put("/users/:id/role", protect, adminOnly, updateUserRole);

export default router;