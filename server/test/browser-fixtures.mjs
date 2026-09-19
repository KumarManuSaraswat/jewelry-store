// Isolated browser QA only. This process never connects to MongoDB or external services.
import express from "express";
import cors from "cors";
import { validateCheckout, checkoutTotals } from "../services/checkout.js";
const app = express();
app.use(cors());
app.use(express.json());
const owner = {
  _id: "000000000000000000000001",
  name: "QA Store Owner",
  email: "owner@example.test",
  role: "admin",
  token: "qa-owner-token",
};
const customer = {
  _id: "000000000000000000000002",
  name: "QA Customer",
  email: "customer@example.test",
  role: "customer",
  token: "qa-customer-token",
};
const image = "/assets/mobile-hero.jpg";
let products = [
  {
    _id: "000000000000000000000011",
    title: "QA Pearl Earrings",
    slug: "qa-pearl-earrings",
    description: "Isolated test product, never published.",
    price: 1200,
    discountPrice: 1000,
    category: "earrings",
    images: [image],
    materials: ["Gold plated"],
    stock: 4,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    _id: "000000000000000000000012",
    title: "QA Gold Ring",
    slug: "qa-gold-ring",
    description: "Isolated test product.",
    price: 2500,
    discountPrice: 0,
    category: "rings",
    images: [image],
    materials: ["Gold plated"],
    stock: 10,
    isFeatured: false,
    isNewArrival: true,
    createdAt: "2026-09-02T00:00:00Z",
  },
];
let orders = [
  {
    _id: "000000000000000000000021",
    user: customer,
    orderItems: [
      {
        product: products[0]._id,
        title: products[0].title,
        image,
        quantity: 1,
        price: 1000,
      },
    ],
    shippingAddress: {
      fullName: "QA Customer",
      phone: "9000000000",
      addressLine1: "Test address",
      addressLine2: "",
      city: "Jaipur",
      state: "Rajasthan",
      postalCode: "302001",
      country: "India",
    },
    paymentMethod: "cod",
    paymentStatus: "paid",
    isPaid: true,
    orderStatus: "processing",
    ...checkoutTotals([{ price: 1000, quantity: 1 }]),
    createdAt: new Date().toISOString(),
    courier: "",
    trackingNumber: "",
  },
];
app.post("/api/auth/login", (req, res) =>
  res.json(req.body.email === owner.email ? owner : customer),
);
app.get("/api/products", (req, res) =>
  res.json(
    req.query.category
      ? products.filter((p) => p.category === req.query.category)
      : products,
  ),
);
app.get("/api/products/:slug", (req, res) => {
  const product = products.find((p) => p.slug === req.params.slug);
  res.status(product ? 200 : 404).json(product || { message: "Not found" });
});
app.get("/api/admin/stats", (req, res) =>
  res.json({
    salesByMonth: [{ _id: 9, totalSales: 1129, totalOrders: 1 }],
    yearlySales: [],
    totalCustomers: 1,
    totalAdmins: 1,
  }),
);
app.get("/api/users", (req, res) => res.json([owner, customer]));
app.get("/api/orders/my-orders", (req, res) => res.json(orders));
app.get("/api/orders", (req, res) => res.json(orders));
app.get("/api/orders/:id", (req, res) =>
  res.json(orders.find((o) => o._id === req.params.id)),
);
app.put("/api/products/:id", (req, res) => {
  products = products.map((p) =>
    p._id === req.params.id ? { ...p, ...req.body } : p,
  );
  res.json(products.find((p) => p._id === req.params.id));
});
app.post("/api/products", (req, res) => {
  const product = {
    ...req.body,
    _id: "000000000000000000000099",
    createdAt: new Date().toISOString(),
  };
  products.push(product);
  res.status(201).json(product);
});
app.put("/api/orders/:id/status", (req, res) => {
  orders = orders.map((o) =>
    o._id === req.params.id ? { ...o, ...req.body } : o,
  );
  res.json(orders.find((o) => o._id === req.params.id));
});
app.post("/api/orders", (req, res) => {
  try {
    const input = validateCheckout(req.body);
    const items = [...input.quantities].map(([id, quantity]) => {
      const p = products.find((p) => p._id === id);
      if (!p || p.stock < quantity) throw new Error("Not enough stock");
      return {
        product: id,
        title: p.title,
        image,
        price: p.discountPrice || p.price,
        quantity,
      };
    });
    const order = {
      _id: "000000000000000000000031",
      user: customer,
      orderItems: items,
      shippingAddress: input.shippingAddress,
      paymentMethod: input.paymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending",
      ...checkoutTotals(items),
      createdAt: new Date().toISOString(),
    };
    orders.push(order);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
app.listen(5099, "127.0.0.1", () =>
  console.log("Isolated QA API ready on 5099. No real data or payments."),
);
