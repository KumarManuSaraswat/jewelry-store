import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    const productIds = orderItems.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    const normalizedItems = orderItems.map((item) => {
      const matchedProduct = products.find(
        (p) => p._id.toString() === item.product.toString()
      );

      if (!matchedProduct) {
        throw new Error(`Product not found: ${item.product}`);
      }

      const finalPrice =
        matchedProduct.discountPrice > 0
          ? matchedProduct.discountPrice
          : matchedProduct.price;

      return {
        product: matchedProduct._id,
        title: matchedProduct.title,
        image: matchedProduct.images?.[0] || "",
        price: finalPrice,
        quantity: item.quantity,
      };
    });

    const itemsPrice = normalizedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const shippingPrice = itemsPrice > 1999 ? 0 : 99;
    const taxPrice = Math.round(itemsPrice * 0.03);
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const order = await Order.create({
      user: req.user._id,
      orderItems: normalizedItems,
      shippingAddress,
      paymentMethod: paymentMethod || "cod",
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentStatus = "paid";
    order.paymentResult = {
      id: req.body.id || "manual-test-payment",
      status: req.body.status || "COMPLETED",
      updateTime: new Date().toISOString(),
      emailAddress: req.body.emailAddress || "",
    };

    if (order.orderStatus === "pending") {
      order.orderStatus = "processing";
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
      if (orderStatus === "delivered") {
        order.isDelivered = true;
        order.deliveredAt = new Date();
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
      if (paymentStatus === "paid") {
        order.isPaid = true;
        order.paidAt = order.paidAt || new Date();
      }
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};