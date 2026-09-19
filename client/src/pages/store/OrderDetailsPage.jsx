import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axios";
import { money, whatsapp } from "../../utils/store";
import OrderSummary from "../../components/OrderSummary";
import PaymentButton from "../../components/PaymentButton";
export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/api/orders/" + id, { signal: controller.signal })
      .then(({ data }) => setOrder(data))
      .catch((err) => {
        if (err.code !== "ERR_CANCELED")
          setError(
            err.response?.data?.message ||
              "Unable to load your order. Please try again.",
          );
      });
    return () => controller.abort();
  }, [id]);
  if (error)
    return (
      <div className="container page-shell">
        <p className="error-message" role="alert">
          {error}
        </p>
        <Link className="btn-secondary" to="/my-orders">
          Back to orders
        </Link>
      </div>
    );
  if (!order)
    return (
      <div className="container page-shell" role="status">
        Finding your order…
      </div>
    );
  const stages = ["pending", "processing", "shipped", "delivered"];
  const address = order.shippingAddress;
  return (
    <div className="page-shell">
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/my-orders">My orders</Link> /{" "}
          <span>#{order._id.slice(-6).toUpperCase()}</span>
        </nav>
        <div className="section-head">
          <div>
            <p className="eyebrow">
              ORDER #{order._id.slice(-6).toUpperCase()}
            </p>
            <h1 className="section-title">A little joy, on its way.</h1>
            <p className="section-subtitle">
              Placed{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
        {order.orderStatus === "cancelled" ? (
          <p className="error-message">
            This order has been cancelled. Please contact us for any payment or
            refund questions.
          </p>
        ) : (
          <div
            className="order-progress"
            aria-label={"Order status: " + order.orderStatus}
          >
            {stages.map((stage, i) => (
              <span
                key={stage}
                className={i <= stages.indexOf(order.orderStatus) ? "done" : ""}
              >
                {stage === "pending" ? "Order placed" : stage}
              </span>
            ))}
          </div>
        )}
        <div className="shop-layout">
          <div>
            {order.orderItems.map((item) => (
              <article key={item.product} className="bag-item">
                <img src={item.image} alt={item.title} />
                <div>
                  <h3>{item.title}</h3>
                  <p>
                    {money(item.price)} × {item.quantity}
                  </p>
                </div>
                <strong>{money(item.price * item.quantity)}</strong>
              </article>
            ))}
            <div className="checkout-section" style={{ marginTop: 30 }}>
              <h2>Delivering to</h2>
              <p>
                {address.fullName}
                <br />
                {address.addressLine1}
                {address.addressLine2 ? ", " + address.addressLine2 : ""}
                <br />
                {address.city}, {address.state} {address.postalCode}
                <br />
                {address.country}
                <br />
                {address.phone}
              </p>
              {order.trackingNumber && (
                <p>
                  <strong>Tracking:</strong> {order.courier} ·{" "}
                  {order.trackingNumber}
                </p>
              )}
              <p>
                <strong>Payment:</strong>{" "}
                {order.paymentMethod === "cod"
                  ? "Cash on delivery"
                  : order.paymentMethod === "whatsapp"
                    ? "Arrange with Orniva on WhatsApp"
                    : order.paymentMethod}{" "}
                · {order.paymentStatus}
              </p>
            </div>
          </div>
          <OrderSummary totals={order}>
            {order.paymentMethod === "razorpay" &&
              !order.isPaid &&
              order.orderStatus !== "cancelled" && (
                <PaymentButton order={order} onPaid={setOrder} />
              )}
            <a
              className="btn-primary"
              href={whatsapp(
                "Hello ORNIVA, " +
                  (order.paymentMethod === "whatsapp"
                    ? "I would like to confirm my order and arrange payment."
                    : "I have a question about my order.") +
                  " Order ID: " +
                  order._id +
                  ". Total: " +
                  money(order.totalPrice) +
                  ".",
              )}
              target="_blank"
              rel="noreferrer"
            >
              {order.paymentMethod === "whatsapp"
                ? "Confirm on WhatsApp ↗"
                : "Ask about this order ↗"}
            </a>
            <Link className="btn-secondary" to="/shop">
              Keep exploring
            </Link>
          </OrderSummary>
        </div>
      </div>
    </div>
  );
}
