import Order from "../models/Order.js";
import User from "../models/User.js";

export const getAdminStats = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const salesByMonth = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const yearlySales = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: { $year: "$createdAt" },
          totalSales: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    const totalCustomers = await User.countDocuments({ role: "customer" });
    const totalAdmins = await User.countDocuments({ role: "admin" });

    res.json({
      salesByMonth,
      yearlySales,
      totalCustomers,
      totalAdmins,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsersForAdmin = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};