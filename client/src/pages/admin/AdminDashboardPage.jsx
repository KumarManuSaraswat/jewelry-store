import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { money } from "../../utils/store";
import Icon from "../../components/Icon";
export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      api.get("/api/admin/stats", { signal: controller.signal }),
      api.get("/api/orders", { signal: controller.signal }),
      api.get("/api/products", { signal: controller.signal }),
    ])
      .then(([stats, orders, products]) =>
        setData({
          stats: stats.data,
          orders: orders.data,
          products: products.data,
        }),
      )
      .catch((err) => {
        if (err.code !== "ERR_CANCELED")
          setError(
            err.response?.data?.message ||
              "Unable to load your store. Please try again.",
          );
      });
    return () => controller.abort();
  }, []);
  const months = Array.from({ length: 12 }, (_, i) => ({
    name: new Date(2026, i, 1).toLocaleString("en", { month: "short" }),
    total:
      data?.stats.salesByMonth.find((s) => s._id === i + 1)?.totalSales || 0,
  }));
  const lowStock = data?.products.filter((p) => p.stock <= 5) || [];
  const revenue =
    data?.stats.salesByMonth.reduce((s, m) => s + m.totalSales, 0) || 0;
  const max = Math.max(...months.map((m) => m.total), 1);
  return (
    <div>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">YOUR STORE, AT A GLANCE</p>
          <h1>A lovely day for business.</h1>
          <p className="section-subtitle">Here’s what’s happening at Orniva.</p>
        </div>
        <Link className="btn-primary" to="/admin/products">
          <Icon name="plus" size={17} /> Add a piece
        </Link>
      </div>
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      {!data && !error ? (
        <p role="status">Loading your store…</p>
      ) : (
        data && (
          <>
            <div className="analytics-grid">
              {[
                ["Paid sales this year", money(revenue)],
                [
                  "Orders to fulfill",
                  data.orders.filter((o) =>
                    ["pending", "processing"].includes(o.orderStatus),
                  ).length,
                ],
                ["Customers", data.stats.totalCustomers],
                ["Pieces low on stock", lowStock.length],
              ].map(([label, value]) => (
                <article className="analytics-card" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </article>
              ))}
            </div>
            <div className="admin-columns">
              <section className="admin-section-card">
                <div className="section-head">
                  <h2>Sales through the year</h2>
                  <span className="summary-note">
                    {new Date().getFullYear()} · Paid orders
                  </span>
                </div>
                <div
                  className="sales-chart"
                  role="img"
                  aria-label={
                    "Monthly sales: " +
                    months.map((m) => m.name + " " + money(m.total)).join(", ")
                  }
                >
                  {months.map((m) => (
                    <div
                      className="sales-bar"
                      key={m.name}
                      title={m.name + ": " + money(m.total)}
                    >
                      <div
                        className="bar"
                        style={{ height: (m.total / max) * 145 + "px" }}
                      />
                      <span>{m.name}</span>
                    </div>
                  ))}
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Paid revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {months
                        .filter((m) => m.total)
                        .map((m) => (
                          <tr key={m.name}>
                            <td>{m.name}</td>
                            <td>{money(m.total)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                {!revenue && (
                  <p className="summary-note">
                    Your paid sales will appear here when orders are confirmed.
                  </p>
                )}
              </section>
              <section className="admin-section-card">
                <h2>A little attention needed</h2>
                {lowStock.length ? (
                  lowStock.slice(0, 5).map((p) => (
                    <div className="user-role-row" key={p._id}>
                      <div>
                        <strong>{p.title}</strong>
                        <p className="summary-note">
                          {p.stock
                            ? p.stock + " left in stock"
                            : "Out of stock"}
                        </p>
                      </div>
                      <Link
                        className="text-link"
                        to="/admin/products?stock=low"
                      >
                        Restock
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="summary-note">
                    Your stock levels look healthy.
                  </p>
                )}
                <Link
                  to="/admin/products"
                  className="text-link"
                  style={{ marginTop: 25 }}
                >
                  Manage inventory →
                </Link>
              </section>
            </div>
            <section className="admin-section-card">
              <div className="section-head">
                <h2>Recent orders</h2>
                <Link className="text-link" to="/admin/orders">
                  View all orders →
                </Link>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Fulfillment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.orders.slice(0, 6).map((o) => (
                      <tr key={o._id}>
                        <td>
                          <Link to={"/admin/orders/" + o._id}>
                            #{o._id.slice(-6).toUpperCase()}
                          </Link>
                        </td>
                        <td>{o.shippingAddress.fullName}</td>
                        <td>
                          {new Date(o.createdAt).toLocaleDateString("en-IN")}
                        </td>
                        <td>{money(o.totalPrice)}</td>
                        <td>
                          <span className={"status-badge " + o.paymentStatus}>
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <span className={"status-badge " + o.orderStatus}>
                            {o.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!data.orders.length && (
                <p className="admin-empty">
                  Your first order will appear here.
                </p>
              )}
            </section>
          </>
        )
      )}
    </div>
  );
}
