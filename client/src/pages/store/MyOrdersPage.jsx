import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { getUserInfo, logoutUser } from "../../utils/auth";
import { money } from "../../utils/store";
export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = getUserInfo();
  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/api/orders/my-orders", { signal: controller.signal })
      .then(({ data }) => setOrders(data))
      .catch((err) => {
        if (err.code !== "ERR_CANCELED")
          setError(
            err.response?.data?.message ||
              "Unable to load your orders. Please try again.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);
  return (
    <div className="page-shell">
      <div className="container">
        <div className="account-header">
          <div>
            <p className="eyebrow">YOUR ORNIVA</p>
            <h1>Hello, {user?.name?.split(" ")[0] || "lovely"}.</h1>
          </div>
          <button
            className="link-button"
            onClick={() => {
              logoutUser();
              navigate("/");
            }}
          >
            Sign out
          </button>
        </div>
        <section className="section">
          <div className="section-head">
            <h2>
              Your little <em>joys.</em>
            </h2>
            <Link className="text-link" to="/shop">
              Find something new
            </Link>
          </div>
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
          {loading ? (
            <p role="status">Loading your orders…</p>
          ) : !orders.length && !error ? (
            <div className="empty-state">
              <h3>Your story starts here.</h3>
              <p>Once you place your first order, you’ll find it here.</p>
              <Link to="/shop" className="btn-primary">
                Explore Orniva
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <article className="order-card" key={order._id}>
                <div>
                  <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
                  <p>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    · {order.orderItems.reduce((n, i) => n + i.quantity, 0)}{" "}
                    pieces
                  </p>
                </div>
                <span className={"status-badge " + order.orderStatus}>
                  {order.orderStatus}
                </span>
                <strong>{money(order.totalPrice)}</strong>
                <Link className="text-link" to={"/orders/" + order._id}>
                  View order →
                </Link>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
