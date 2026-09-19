import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import Order from "../models/Order.js";
import { paymentWebhook } from "../controllers/paymentWebhook.js";
const response = () => ({
  code: 200,
  status(code) {
    this.code = code;
    return this;
  },
  json(data) {
    this.data = data;
    return this;
  },
});
test("webhook rejects forged notifications without accessing orders", async (t) => {
  const old = process.env.RAZORPAY_WEBHOOK_SECRET;
  process.env.RAZORPAY_WEBHOOK_SECRET = "qa-webhook";
  t.mock.method(Order, "findOne", () =>
    assert.fail("No database access for invalid signatures"),
  );
  try {
    const res = response();
    await paymentWebhook(
      {
        body: Buffer.from("{}"),
        headers: { "x-razorpay-signature": "0".repeat(64) },
      },
      res,
    );
    assert.equal(res.code, 400);
  } finally {
    process.env.RAZORPAY_WEBHOOK_SECRET = old;
  }
});
test("captured webhook checks currency and amount and protects refunds from replay", async (t) => {
  const old = process.env.RAZORPAY_WEBHOOK_SECRET;
  process.env.RAZORPAY_WEBHOOK_SECRET = "qa-webhook";
  const updates = [];
  t.mock.method(Order, "findOne", async () => ({
    _id: "qa-order",
    totalPrice: 1129,
  }));
  t.mock.method(Order, "updateOne", async (query, update) => {
    updates.push({ query, update });
  });
  try {
    const body = Buffer.from(
      JSON.stringify({
        event: "payment.captured",
        payload: {
          payment: {
            entity: {
              id: "qa-payment",
              order_id: "qa-order",
              status: "captured",
              currency: "INR",
              amount: 112900,
            },
          },
        },
      }),
    );
    const signature = crypto
      .createHmac("sha256", "qa-webhook")
      .update(body)
      .digest("hex");
    const res = response();
    await paymentWebhook(
      { body, headers: { "x-razorpay-signature": signature } },
      res,
    );
    assert.equal(res.code, 200);
    assert.deepEqual(updates[0].query.paymentStatus, {
      $nin: ["paid", "refunded"],
    });
    assert.equal(updates[1].query.orderStatus, "pending");
    assert.equal(updates[1].query.paymentStatus, "paid");
    const wrong = Buffer.from(body.toString().replace("112900", "100"));
    const wrongSignature = crypto
      .createHmac("sha256", "qa-webhook")
      .update(wrong)
      .digest("hex");
    const mismatch = response();
    await paymentWebhook(
      { body: wrong, headers: { "x-razorpay-signature": wrongSignature } },
      mismatch,
    );
    assert.equal(mismatch.code, 400);
    assert.equal(updates.length, 2);
  } finally {
    process.env.RAZORPAY_WEBHOOK_SECRET = old;
  }
});
