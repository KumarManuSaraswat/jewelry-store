import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import { getAllUsers, updateUserRole } from "../controllers/userController.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllUsers);
router.put("/:id/role", protect, adminOnly, updateUserRole);

export default router;