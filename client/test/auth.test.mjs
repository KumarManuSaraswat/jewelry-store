import test from "node:test";
import assert from "node:assert/strict";
import {
  hasAdminAccess,
  loginDestination,
  parseSession,
  safeReturnPath,
} from "../src/utils/auth.js";

const admin = {
  email: "owner@example.test",
  role: "admin",
  token: "test-session",
};
const customer = {
  email: admin.email,
  role: "customer",
  token: "test-session",
};
test("email alone never grants owner navigation", () => {
  for (const user of [
    null,
    customer,
    { ...admin, token: "" },
    { ...admin, token: " " },
    { ...admin, role: undefined },
  ])
    assert.equal(hasAdminAccess(user), false);
  assert.equal(hasAdminAccess(admin), true);
});
test("normal sign-in directs owners to their dashboard and customers to their orders", () => {
  assert.equal(loginDestination(admin), "/admin");
  assert.equal(loginDestination(customer), "/my-orders");
});
test("checkout and owner deep links preserve the authorized destination", () => {
  assert.equal(loginDestination(admin, "/checkout"), "/checkout");
  assert.equal(loginDestination(customer, "/checkout"), "/checkout");
  assert.equal(
    loginDestination(admin, "/admin/products?stock=low"),
    "/admin/products?stock=low",
  );
  for (const path of [
    "/admin",
    "/admin/products",
    "/ADMIN/orders",
    "/admin?view=orders",
  ])
    assert.equal(loginDestination(customer, path), "/my-orders");
});
test("external destinations and login loops cannot override sign-in defaults", () => {
  for (const path of [
    "https://example.test",
    "//example.test",
    "/\\example.test",
    "/\nexample.test",
    undefined,
    {},
  ])
    assert.equal(safeReturnPath(path), null);
  for (const path of ["/login", "/register?redirect=/login", "/admin/login"])
    assert.equal(loginDestination(admin, path), "/admin");
});
test("malformed or incomplete stored sessions cannot show owner controls", () => {
  for (const value of [
    null,
    "not-json",
    "{}",
    JSON.stringify({ role: "admin" }),
    JSON.stringify({ role: "admin", token: 12 }),
  ])
    assert.equal(parseSession(value), null);
  assert.deepEqual(parseSession(JSON.stringify(admin)), admin);
});
