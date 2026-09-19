import crypto from "crypto";
import Order from "../models/Order.js";
export async function paymentWebhook(req, res) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret)
    return res.status(503).json({ message: "Webhook is not configured." });
  const signature = req.headers["x-razorpay-signature"];
  const expected = crypto
    .createHmac("sha256", secret)
    .update(req.body)
    .digest("hex");
  if (
    typeof signature !== "string" ||
    !/^[a-f0-9]{64}$/i.test(signature) ||
    !crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expected, "hex"),
    )
  )
    return res.status(400).json({ message: "Invalid signature." });
  try {
    const event = JSON.parse(req.body.toString("utf8"));
    if (event.event === "payment.captured") {
      const payment = event.payload?.payment?.entity;
      if (
        !payment ||
        payment.status !== "captured" ||
        payment.currency !== "INR"
      )
        return res.status(400).json({ message: "Invalid payment event." });
      const order = await Order.findOne({ razorpayOrderId: payment.order_id });
      if (!order) return res.status(404).json({ message: "Order not found." });
      if (payment.amount !== Math.round(order.totalPrice * 100))
        return res.status(400).json({ message: "Payment amount mismatch." });
      // Repeated provider notifications are idempotent. Never reopen cancelled or shipped orders.
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
            razorpayPaymentId: payment.id,
          },
        },
      );
      await Order.updateOne(
        { _id: order._id, orderStatus: "pending", paymentStatus: "paid" },
        { $set: { orderStatus: "processing" } },
      );
    }
    res.json({ received: true });
  } catch {
    res
      .status(500)
      .json({ message: "Unable to process payment notification." });
  }
}
