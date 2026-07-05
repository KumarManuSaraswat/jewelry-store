import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import connectDB from "../config/db.js";

dotenv.config();

const makeDateInMonth = (year, monthIndex) => {
  const day = Math.floor(Math.random() * 25) + 1;
  return new Date(year, monthIndex, day, 12, 0, 0);
};

const runSeed = async () => {
  try {
    await connectDB();

    const users = await User.find().limit(5);
    const products = await Product.find().limit(8);

    if (!users.length || !products.length) {
      throw new Error("Need existing users and products before seeding orders");
    }

    await Order.deleteMany({});

    const currentYear = new Date().getFullYear();
    const orders = [];

    for (let month = 0; month < 12; month++) {
      const monthlyOrderCount = Math.floor(Math.random() * 6) + 3;

      for (let i = 0; i < monthlyOrderCount; i++) {
        const user = users[Math.floor(Math.random() * users.length)];
        const itemCount = Math.floor(Math.random() * 3) + 1;

        const selectedProducts = [];
        for (let j = 0; j < itemCount; j++) {
          const product = products[Math.floor(Math.random() * products.length)];
          const finalPrice =
            product.discountPrice > 0 ? product.discountPrice : product.price;

          selectedProducts.push({
            product: product._id,
            title: product.title,
            image: product.images?.[0] || "",
            price: finalPrice,
            quantity: Math.floor(Math.random() * 2) + 1,
          });
        }

        const itemsPrice = selectedProducts.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        const shippingPrice = itemsPrice > 1999 ? 0 : 99;
        const taxPrice = Math.round(itemsPrice * 0.03);
        const totalPrice = itemsPrice + shippingPrice + taxPrice;
        const createdAt = makeDateInMonth(currentYear, month);

        const orderStatusOptions = ["processing", "shipped", "delivered"];
        const orderStatus =
          orderStatusOptions[Math.floor(Math.random() * orderStatusOptions.length)];

        orders.push({
          user: user._id,
          orderItems: selectedProducts,
          shippingAddress: {
            fullName: user.name,
            phone: "9999999999",
            addressLine1: "Sample Address 1",
            addressLine2: "Near Landmark",
            city: "Jaipur",
            state: "Rajasthan",
            postalCode: "302001",
            country: "India",
          },
          paymentMethod: "cod",
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
          paymentStatus: "paid",
          orderStatus,
          isPaid: true,
          paidAt: createdAt,
          isDelivered: orderStatus === "delivered",
          deliveredAt: orderStatus === "delivered" ? createdAt : null,
          paymentResult: {
            id: `seed_payment_${month + 1}_${i + 1}`,
            status: "COMPLETED",
            updateTime: createdAt.toISOString(),
            emailAddress: user.email,
          },
          createdAt,
          updatedAt: createdAt,
        });
      }
    }

    await Order.insertMany(orders);

    console.log(`Seeded ${orders.length} paid orders`);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runSeed();