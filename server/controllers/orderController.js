import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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
    const order = await Order.findById(req.params.id).populate("user", "name email");

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
      signature: req.body.signature || "",
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

export const createRazorpayOrder = async (req, res) => {
  try {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: "Razorpay keys are not configured" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized for this order" });
    }

    if (order.isPaid) {
      return res.status(400).json({ message: "Order is already paid" });
    }

    const options = {
      amount: Math.round(order.totalPrice * 100),
      currency: "INR",
      receipt: `receipt_order_${order._id}`,
      notes: {
        mongoOrderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    order.paymentMethod = "razorpay";
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json({
      key: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId: order._id,
      customer: {
        name: order.shippingAddress.fullName,
        email: req.user.email || "",
        contact: order.shippingAddress.phone || "",
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing Razorpay payment details" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized for this order" });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      order.paymentStatus = "failed";
      await order.save();
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentStatus = "paid";
    order.orderStatus = "processing";
    order.paymentMethod = "razorpay";
    order.razorpayOrderId = razorpay_order_id;
    order.razorpayPaymentId = razorpay_payment_id;
    order.paymentResult = {
      id: razorpay_payment_id,
      status: "paid",
      updateTime: new Date().toISOString(),
      emailAddress: req.user.email || "",
      signature: razorpay_signature,
    };

    const updatedOrder = await order.save();

    res.json({
      message: "Payment verified successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { orderStatus, isDelivered, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;

      if (paymentStatus === "paid") {
        order.isPaid = true;
        order.paidAt = order.paidAt || new Date();
      }

      if (paymentStatus === "failed") {
        order.isPaid = false;
      }

      if (paymentStatus === "pending") {
        order.isPaid = false;
        order.paidAt = undefined;
      }
    }

    if (typeof isDelivered === "boolean") {
      order.isDelivered = isDelivered;
      order.deliveredAt = isDelivered ? new Date() : null;
    }

    if (orderStatus === "delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};