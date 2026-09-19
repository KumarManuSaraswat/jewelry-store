import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axios";
import { money } from "../../utils/store";
import OrderSummary from "../../components/OrderSummary";
export default function AdminOrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/api/orders/" + id, { signal: controller.signal })
      .then(({ data }) => {
        setOrder(data);
        setForm({
          orderStatus: data.orderStatus,
          paymentStatus: data.paymentStatus,
          courier: data.courier || "",
          trackingNumber: data.trackingNumber || "",
        });
      })
      .catch((err) => {
        if (err.code !== "ERR_CANCELED")
          setError(err.response?.data?.message || "Unable to load order.");
      });
    return () => controller.abort();
  }, [id]);
  async function save(e) {
    e.preventDefault();
    if (
      form.orderStatus === "cancelled" &&
      order.orderStatus !== "cancelled" &&
      !window.confirm(
        "Cancel this order and return its reserved items to inventory? Any paid refund must be arranged separately.",
      )
    )
      return;
    setBusy(true);
    setError("");
    setSaved("");
    try {
      const { data } = await api.put("/api/orders/" + id + "/status", form);
      setOrder(data);
      setSaved("Order updated.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not update order.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <Link className="text-link" to="/admin/orders">
        ← All orders
      </Link>
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      {!order ? (
        !error && <p role="status">Loading order…</p>
      ) : (
        <>
          <div className="admin-heading" style={{ marginTop: 25 }}>
            <div>
              <p className="eyebrow">
                {new Date(order.createdAt).toLocaleDateString("en-IN")}
              </p>
              <h1>Order #{id.slice(-6).toUpperCase()}</h1>
            </div>
            <span className={"status-badge " + order.orderStatus}>
              {order.orderStatus}
            </span>
          </div>
          {saved && (
            <p className="success-message" role="status">
              {saved}
            </p>
          )}
          <div className="admin-columns">
            <div>
              <section className="admin-section-card">
                <h2>Ordered pieces</h2>
                {order.orderItems.map((item) => (
                  <div className="user-role-row" key={item.product}>
                    <div className="table-product">
                      <img src={item.image} alt="" />
                      <div>
                        {item.title}
                        <small>
                          {money(item.price)} × {item.quantity}
                        </small>
                      </div>
                    </div>
                    <strong>{money(item.price * item.quantity)}</strong>
                  </div>
                ))}
              </section>
              <section className="admin-section-card">
                <h2>Delivery details</h2>
                <p>
                  {order.shippingAddress.fullName}
                  <br />
                  {order.shippingAddress.addressLine1}
                  <br />
                  {order.shippingAddress.addressLine2 && (
                    <>
                      {order.shippingAddress.addressLine2}
                      <br />
                    </>
                  )}
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                  <br />
                  {order.shippingAddress.country}
                </p>
                <p>
                  <a href={"tel:" + order.shippingAddress.phone}>
                    {order.shippingAddress.phone}
                  </a>
                  <br />
                  {order.user?.email}
                </p>
              </section>
              <section className="admin-section-card">
                <h2>Fulfillment & payment</h2>
                <form className="form-grid" onSubmit={save}>
                  <label>
                    Order status
                    <select
                      value={form.orderStatus}
                      onChange={(e) =>
                        setForm({ ...form, orderStatus: e.target.value })
                      }
                    >
                      {[
                        "pending",
                        "processing",
                        "shipped",
                        "delivered",
                        "cancelled",
                      ].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Payment status
                    <select
                      value={form.paymentStatus}
                      onChange={(e) =>
                        setForm({ ...form, paymentStatus: e.target.value })
                      }
                    >
                      {["pending", "paid", "failed", "refunded"].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Courier
                    <input
                      value={form.courier}
                      onChange={(e) =>
                        setForm({ ...form, courier: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Tracking number
                    <input
                      value={form.trackingNumber}
                      onChange={(e) =>
                        setForm({ ...form, trackingNumber: e.target.value })
                      }
                    />
                  </label>
                  <p className="summary-note full-width">
                    Payment method: {order.paymentMethod}. Marking a refund
                    records its status; issue the actual refund through your
                    payment provider.
                  </p>
                  <button className="btn-primary full-width" disabled={busy}>
                    {busy ? "Saving…" : "Save order updates"}
                  </button>
                </form>
              </section>
            </div>
            <OrderSummary totals={order} />
          </div>
        </>
      )}
    </div>
  );
}
