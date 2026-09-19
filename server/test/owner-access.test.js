import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import app from "../app.js";
import User from "../models/User.js";

test("a signed-in customer cannot access owner APIs even when a token claims admin", async (t) => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "isolated-owner-access-test";
  const id = "000000000000000000000002";
  t.mock.method(User, "findById", () => ({
    select: async () => ({ _id: id, role: "customer" }),
  }));
  const token = jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET);
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  const base = "http://127.0.0.1:" + server.address().port;
  try {
    for (const [method, path] of [
      ["GET", "/api/admin/stats"],
      ["GET", "/api/admin/users"],
      ["GET", "/api/users"],
      ["GET", "/api/orders"],
      ["POST", "/api/products"],
      ["PUT", "/api/products/" + id],
      ["DELETE", "/api/products/" + id],
      ["PUT", "/api/admin/users/" + id + "/role"],
      ["PUT", "/api/orders/" + id + "/status"],
      ["PUT", "/api/orders/" + id + "/pay"],
    ]) {
      const response = await fetch(base + path, {
        method,
        headers: { Authorization: "Bearer " + token },
      });
      assert.equal(response.status, 403, `${method} ${path}`);
    }
  } finally {
    await new Promise((resolve) => server.close(resolve));
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  }
});
