import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import Order from "./models/Order.js";
try {
  await connectDB();
  await Order.init();
  app.listen(process.env.PORT || 5000, () =>
    console.log("Orniva API is ready."),
  );
} catch {
  console.error(
    "Unable to connect to the database. Check the connection settings and Atlas network access.",
  );
  process.exitCode = 1;
}
