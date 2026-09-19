import "dotenv/config";
import crypto from "crypto";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import {
  CheckoutError,
  validateCheckout,
  checkoutTotals,
  reserveItems,
} from "../services/checkout.js";

const fail = (res, error) =>
  res
    .status(
      error.status ||
        (error.name === "ValidationError" || error.name === "CastError"
          ? 400
          : 500),
    )
    .json({
      message: error.status
        ? error.message
        : "We couldn’t complete this request. Please try again.",
    });
const gateway = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET)
    throw new CheckoutError(
      "Online payments are not available yet. Please contact Orniva.",
      503,
    );
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};
export const createOrder = async (req, res) => {
  let session;
  try {
    const { quantities, shippingAddress, paymentMethod } = validateCheckout(
      req.body,
    );
    if (
      paymentMethod === "razorpay" &&
      process.env.ENABLE_ONLINE_PAYMENTS !== "true"
    )
      throw new CheckoutError(
        "Online payment is not available. Please choose another payment method.",
      );
    const requestId = req.body.requestId || crypto.randomUUID();
    session = await mongoose.startSession();
    let order;
    await session.withTransaction(async () => {
      const previous = await Order.findOne({
        user: req.user._id,
        requestId,
      }).session(session);
      if (previous) {
        order = previous;
        return;
      }
      const items = await reserveItems(quantities, Product, session);
      [order] = await Order.create(
        [
          {
            user: req.user._id,
            requestId,
            orderItems: items,
            shippingAddress,
            paymentMethod,
            ...checkoutTotals(items),
            inventoryReserved: true,
          },
        ],
        { session },
      );
    });
    res.status(201).json(order);
  } catch (error) {
    if (error.code === 11000 && req.body.requestId) {
      const order = await Order.findOne({
        user: req.user._id,
        requestId: req.body.requestId,
      });
      if (order) return res.json(order);
    }
    fail(res, error);
  } finally {
    if (session) await session.endSession();
  }
};
export const getMyOrders = async (req, res) => {
  try {
    res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
  } catch (error) {
    fail(res, error);
  }
};
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );
    if (!order) return res.status(404).json({ message: "Order not found." });
    if (
      order.user?._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    )
      return res.status(403).json({ message: "You cannot view this order." });
    res.json(order);
  } catch (error) {
    fail(res, error);
  }
};
export const getAllOrdersAdmin = async (req, res) => {
  try {
    res.json(
      await Order.find({})
        .populate("user", "name email")
        .sort({ createdAt: -1 }),
    );
  } catch (error) {
    fail(res, error);
  }
};
export const markOrderAsPaid = async (req, res) => {
  req.body = { ...req.body, paymentStatus: "paid" };
  return updateOrderStatusAdmin(req, res);
};
export const updateOrderStatusAdmin = async (req, res) => {
  let session;
  try {
    const { orderStatus, paymentStatus, courier, trackingNumber } = req.body;
    if (
      orderStatus &&
      !["pending", "processing", "shipped", "delivered", "cancelled"].includes(
        orderStatus,
      )
    )
      throw new CheckoutError("Invalid order status.");
    if (
      paymentStatus &&
      !["pending", "paid", "failed", "refunded"].includes(paymentStatus)
    )
      throw new CheckoutError("Invalid payment status.");
    if (
      [courier, trackingNumber].some(
        (v) => v !== undefined && (typeof v !== "string" || v.length > 160),
      )
    )
      throw new CheckoutError(
        "Tracking details must be shorter than 160 characters.",
      );
    session = await mongoose.startSession();
    let updated;
    await session.withTransaction(async () => {
      const order = await Order.findById(req.params.id).session(session);
      if (!order) throw new CheckoutError("Order not found.", 404);
      if (
        order.orderStatus === "cancelled" &&
        orderStatus &&
        orderStatus !== "cancelled"
      )
        throw new CheckoutError(
          "Cancelled orders cannot be reopened. Create a new order to reserve stock.",
        );
      if (
        orderStatus === "cancelled" &&
        ["shipped", "delivered"].includes(order.orderStatus)
      )
        throw new CheckoutError(
          "Contact the customer and arrange a return for an order already shipped.",
        );
      if (
        orderStatus === "cancelled" &&
        order.inventoryReserved &&
        !order.inventoryReleased
      ) {
        for (const item of order.orderItems)
          await Product.updateOne(
            { _id: item.product },
            { $inc: { stock: item.quantity } },
            { session },
          );
        order.inventoryReleased = true;
      }
      if (orderStatus) {
        order.orderStatus = orderStatus;
        order.isDelivered = orderStatus === "delivered";
        order.deliveredAt = order.isDelivered
          ? order.deliveredAt || new Date()
          : undefined;
      }
      if (paymentStatus) {
        order.paymentStatus = paymentStatus;
        order.isPaid = paymentStatus === "paid";
        order.paidAt = order.isPaid ? order.paidAt || new Date() : undefined;
      }
      if (courier !== undefined) order.courier = courier.trim();
      if (trackingNumber !== undefined)
        order.trackingNumber = trackingNumber.trim();
      updated = await order.save({ session });
    });
    res.json(updated);
  } catch (error) {
    fail(res, error);
  } finally {
    if (session) await session.endSession();
  }
};
export const createRazorpayOrder = async (req, res) => {
  try {
    if (process.env.ENABLE_ONLINE_PAYMENTS !== "true")
      throw new CheckoutError(
        "Online payments are not available. Please contact Orniva.",
        503,
      );
    const razorpay = gateway();
    const order = await Order.findById(req.params.id);
    if (!order) throw new CheckoutError("Order not found.", 404);
    if (order.user.toString() !== req.user._id.toString())
      throw new CheckoutError("Not authorized for this order.", 403);
    if (order.isPaid || order.orderStatus === "cancelled")
      throw new CheckoutError("This order cannot accept payment.");
    const remote = order.razorpayOrderId
      ? await razorpay.orders.fetch(order.razorpayOrderId)
      : await razorpay.orders.create({
          amount: Math.round(order.totalPrice * 100),
          currency: "INR",
          receipt: order._id.toString(),
        });
    order.razorpayOrderId = remote.id;
    order.paymentMethod = "razorpay";
    await order.save();
    res.json({
      key: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: remote.id,
      amount: remote.amount,
      currency: remote.currency,
      orderId: order._id,
      customer: {
        name: order.shippingAddress.fullName,
        email: req.user.email,
        contact: order.shippingAddress.phone,
      },
    });
  } catch (error) {
    fail(res, error);
  }
};
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const razorpay = gateway();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    if (
      ![razorpay_order_id, razorpay_payment_id, razorpay_signature].every(
        (v) => typeof v === "string" && v,
      )
    )
      throw new CheckoutError("Missing payment details.");
    const order = await Order.findById(req.params.id);
    if (!order) throw new CheckoutError("Order not found.", 404);
    if (order.user.toString() !== req.user._id.toString())
      throw new CheckoutError("Not authorized for this order.", 403);
    if (
      order.orderStatus === "cancelled" ||
      !order.razorpayOrderId ||
      order.razorpayOrderId !== razorpay_order_id
    )
      throw new CheckoutError("This payment does not match the order.");
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(order.razorpayOrderId + "|" + razorpay_payment_id)
      .digest("hex");
    if (
      !/^[a-f0-9]{64}$/i.test(razorpay_signature) ||
      !crypto.timingSafeEqual(
        Buffer.from(expected, "hex"),
        Buffer.from(razorpay_signature, "hex"),
      )
    )
      throw new CheckoutError("Invalid payment signature.");
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    if (
      payment.order_id !== order.razorpayOrderId ||
      payment.amount !== Math.round(order.totalPrice * 100) ||
      payment.currency !== "INR" ||
      payment.status !== "captured"
    )
      throw new CheckoutError(
        "Payment has not been captured for this order. Please contact Orniva.",
        409,
      );
    // Conditional writes preserve a concurrent cancellation or refund.
    await Order.updateOne(
      {
        _id: order._id,
        isPaid: false,
        paymentStatus: { $nin: ["paid", "refunded"] },
      },
      {
        $set: {
          isPaid: true,
          paidAt: new Date(),
          paymentStatus: "paid",
          razorpayPaymentId: razorpay_payment_id,
        },
      },
    );
    await Order.updateOne(
      { _id: order._id, orderStatus: "pending", paymentStatus: "paid" },
      { $set: { orderStatus: "processing" } },
    );
    res.json({
      message: "Payment verified.",
      order: await Order.findById(order._id),
    });
  } catch (error) {
    fail(res, error);
  }
};
