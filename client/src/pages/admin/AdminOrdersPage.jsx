import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { money } from "../../utils/store";
import { exportCsv } from "../../utils/export";
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/api/orders", { signal: controller.signal })
      .then(({ data }) => setOrders(data))
      .catch((err) => {
        if (err.code !== "ERR_CANCELED")
          setError(err.response?.data?.message || "Unable to load orders.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);
  const visible = orders.filter(
    (o) =>
      (!status || o.orderStatus === status) &&
      [o._id, o.shippingAddress.fullName, o.user?.email]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <div>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">EVERY ORDER, A LITTLE JOY</p>
          <h1>Your orders.</h1>
          <p className="section-subtitle">
            Keep every customer’s delivery moving.
          </p>
        </div>
        <button
          className="btn-secondary"
          disabled={!visible.length}
          onClick={() =>
            exportCsv(
              "orniva-orders.csv",
              [
                "Order",
                "Date",
                "Customer",
                "Amount (INR)",
                "Payment",
                "Status",
              ],
              visible.map((o) => [
                o._id,
                new Date(o.createdAt).toISOString(),
                o.shippingAddress.fullName,
                o.totalPrice,
                o.paymentStatus,
                o.orderStatus,
              ]),
            )
          }
        >
          Export orders
        </button>
      </div>
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      <div className="admin-toolbar">
        <input
          aria-label="Search orders"
          placeholder="Order number, customer, or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          aria-label="Filter order status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All orders</option>
          {["pending", "processing", "shipped", "delivered", "cancelled"].map(
            (s) => (
              <option key={s}>{s}</option>
            ),
          )}
        </select>
        <span className="summary-note">{visible.length} orders</span>
      </div>
      <div className="admin-section-card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Placed</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {visible.map((o) => (
              <tr key={o._id}>
                <td>#{o._id.slice(-6).toUpperCase()}</td>
                <td>
                  {o.shippingAddress.fullName}
                  <p className="summary-note">{o.shippingAddress.city}</p>
                </td>
                <td>{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
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
                <td>
                  <Link className="text-link" to={"/admin/orders/" + o._id}>
                    Manage →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading ? (
          <p role="status">Loading orders…</p>
        ) : (
          !visible.length && (
            <p className="admin-empty">No orders match this view.</p>
          )
        )}
      </div>
    </div>
  );
}
