import test from "node:test";
import assert from "node:assert/strict";
import {
  validateCheckout,
  checkoutTotals,
  reserveItems,
} from "../services/checkout.js";
import { orderTotals, priceOf } from "../../client/src/utils/store.js";
import {
  createOrder,
  updateOrderStatusAdmin,
  verifyRazorpayPayment,
} from "../controllers/orderController.js";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import protect from "../middleware/authMiddleware.js";
import app from "../app.js";
const id = "1234567890abcdef12345678";
const other = "1234567890abcdef12345679";
const body = () => ({
  orderItems: [{ product: id, quantity: 2 }],
  shippingAddress: {
    fullName: "QA Customer",
    phone: "9000000000",
    addressLine1: "Test address",
    city: "Jaipur",
    state: "Rajasthan",
    postalCode: "302001",
    country: "India",
  },
  paymentMethod: "cod",
  requestId: "test-request-123456789",
});
const response = () => ({
  code: 200,
  data: null,
  status(code) {
    this.code = code;
    return this;
  },
  json(data) {
    this.data = data;
    return this;
  },
});

test("invalid and fractional quantities are rejected before database access", () => {
  for (const value of [-1, 0, 1.5, "2", NaN, 101]) {
    const input = body();
    input.orderItems[0].quantity = value;
    assert.throws(() => validateCheckout(input));
  }
});
test("duplicate product IDs are merged before stock reservation", () => {
  const input = body();
  input.orderItems.push({ product: id, quantity: 3 });
  assert.equal(validateCheckout(input).quantities.get(id), 5);
});
test("checkout requires valid address, PIN, payment method and idempotency key", () => {
  for (const change of [
    (b) => (b.shippingAddress.postalCode = "000000"),
    (b) => (b.shippingAddress.phone = "123"),
    (b) => (b.shippingAddress.country = "USA"),
    (b) => (b.paymentMethod = "unknown"),
    (b) => (b.requestId = "bad"),
  ]) {
    const input = body();
    change(input);
    assert.throws(() => validateCheckout(input));
  }
  assert.equal(
    validateCheckout({ ...body(), paymentMethod: "whatsapp" }).paymentMethod,
    "whatsapp",
  );
});
test("shipping threshold and tax agree between storefront and server", () => {
  for (const price of [1999, 1999.99, 2000, 200, 3050]) {
    const items = [{ price, quantity: 1 }];
    const expected = checkoutTotals(items);
    const actual = orderTotals(items);
    for (const field of [
      "itemsPrice",
      "shippingPrice",
      "taxPrice",
      "totalPrice",
    ])
      assert.equal(actual[field], expected[field]);
  }
  assert.equal(
    checkoutTotals([{ price: 1999, quantity: 1 }]).shippingPrice,
    99,
  );
  assert.equal(checkoutTotals([{ price: 2000, quantity: 1 }]).shippingPrice, 0);
  assert.equal(orderTotals([]).totalPrice, 0);
});
test("only a valid lower sale price is displayed", () => {
  assert.equal(priceOf({ price: 250, discountPrice: 200 }), 200);
  assert.equal(priceOf({ price: 250, discountPrice: 300 }), 250);
});
test("reservation atomically guards stock and uses database prices", async () => {
  let request;
  const fake = {
    findOneAndUpdate: async (...args) => {
      request = args;
      return {
        _id: id,
        title: "Test piece",
        price: 500,
        discountPrice: 350,
        images: ["photo"],
      };
    },
  };
  const items = await reserveItems(new Map([[id, 2]]), fake, "session");
  assert.deepEqual(request[0], { _id: id, stock: { $gte: 2 } });
  assert.deepEqual(request[1], { $inc: { stock: -2 } });
  assert.equal(request[2].session, "session");
  assert.equal(items[0].price, 350);
  assert.equal(items[0].quantity, 2);
  await assert.rejects(
    reserveItems(
      new Map([[id, 3]]),
      { findOneAndUpdate: async () => null },
      "session",
    ),
    (e) => e.status === 409,
  );
});
test("transaction abort restores earlier reservations when a later item is unavailable", async (t) => {
  let stock = 4;
  let ended = false;
  let created = false;
  t.mock.method(mongoose, "startSession", async () => ({
    withTransaction: async (fn) => {
      const before = stock;
      try {
        await fn();
      } catch (error) {
        stock = before;
        throw error;
      }
    },
    endSession: async () => {
      ended = true;
    },
  }));
  t.mock.method(Order, "findOne", () => ({ session: async () => null }));
  t.mock.method(Product, "findOneAndUpdate", async (query) => {
    if (query._id === other) return null;
    stock -= 2;
    return { _id: id, title: "Test", price: 100, stock, images: [] };
  });
  t.mock.method(Order, "create", async () => {
    created = true;
  });
  const input = body();
  input.orderItems.push({ product: other, quantity: 1 });
  const res = response();
  await createOrder({ body: input, user: { _id: "qa-user" } }, res);
  assert.equal(res.code, 409);
  assert.equal(stock, 4);
  assert.equal(created, false);
  assert.equal(ended, true);
});
test("retried checkout returns the same order without reserving stock again", async (t) => {
  const existing = { _id: "existing-order" };
  let reserved = false;
  t.mock.method(mongoose, "startSession", async () => ({
    withTransaction: async (fn) => fn(),
    endSession: async () => {},
  }));
  t.mock.method(Order, "findOne", () => ({ session: async () => existing }));
  t.mock.method(Product, "findOneAndUpdate", async () => {
    reserved = true;
  });
  const res = response();
  await createOrder({ body: body(), user: { _id: "qa-user" } }, res);
  assert.equal(res.data._id, "existing-order");
  assert.equal(reserved, false);
});
test("a cancelled order releases its reserved inventory only once", async (t) => {
  let restored = 0;
  const order = {
    _id: id,
    orderStatus: "pending",
    inventoryReserved: true,
    inventoryReleased: false,
    orderItems: [{ product: id, quantity: 2 }],
    save: async function () {
      return this;
    },
  };
  t.mock.method(mongoose, "startSession", async () => ({
    withTransaction: async (fn) => fn(),
    endSession: async () => {},
  }));
  t.mock.method(Order, "findById", () => ({ session: async () => order }));
  t.mock.method(Product, "updateOne", async (query, update) => {
    restored += update.$inc.stock;
  });
  for (let i = 0; i < 2; i++) {
    const res = response();
    await updateOrderStatusAdmin(
      { params: { id }, body: { orderStatus: "cancelled" } },
      res,
    );
    assert.equal(res.code, 200);
  }
  assert.equal(restored, 2);
  const res = response();
  await updateOrderStatusAdmin(
    { params: { id }, body: { orderStatus: "processing" } },
    res,
  );
  assert.equal(res.code, 400);
});
test("authentication hydrates the user and rejects sessions invalidated by reset", async (t) => {
  t.mock.method(User, "findById", () => ({
    select: async () => ({ _id: id, role: "customer" }),
  }));
  const token = jwt.sign({ id }, "qa-secret");
  const previous = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "qa-secret";
  try {
    let called = false;
    const req = { headers: { authorization: "Bearer " + token } };
    await protect(req, response(), () => {
      called = true;
    });
    assert.equal(called, true);
    assert.equal(req.user._id, id);
    t.mock.method(User, "findById", () => ({
      select: async () => ({
        _id: id,
        passwordChangedAt: new Date(Date.now() + 1000),
      }),
    }));
    const res = response();
    await protect({ headers: { authorization: "Bearer " + token } }, res, () =>
      assert.fail("must reject"),
    );
    assert.equal(res.code, 401);
  } finally {
    process.env.JWT_SECRET = previous;
  }
});
test("payment for a different Razorpay order is rejected before provider lookup", async (t) => {
  const before = [process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET];
  process.env.RAZORPAY_KEY_ID = "qa-key";
  process.env.RAZORPAY_KEY_SECRET = "qa-secret";
  t.mock.method(Order, "findById", async () => ({
    user: id,
    razorpayOrderId: "order_expected",
    orderStatus: "pending",
  }));
  try {
    const res = response();
    await verifyRazorpayPayment(
      {
        params: { id },
        user: { _id: id },
        body: {
          razorpay_order_id: "order_other",
          razorpay_payment_id: "pay_1",
          razorpay_signature: "a".repeat(64),
        },
      },
      res,
    );
    assert.equal(res.code, 400);
    assert.match(res.data.message, /does not match/);
  } finally {
    [process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET] = before;
  }
});
test("HTTP routes protect owner data and manual payment changes", async () => {
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = "http://127.0.0.1:" + server.address().port;
  try {
    for (const [path, method] of [
      ["/api/orders", "GET"],
      ["/api/admin/stats", "GET"],
      ["/api/users", "GET"],
      ["/api/orders/" + id + "/pay", "PUT"],
    ]) {
      const response = await fetch(base + path, { method });
      assert.equal(response.status, 401);
    }
    const invalid = await fetch(base + "/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    assert.equal(invalid.status, 400);
    const cors = await fetch(base + "/", {
      headers: { Origin: "https://untrusted.example" },
    });
    assert.equal(cors.headers.get("access-control-allow-origin"), null);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
