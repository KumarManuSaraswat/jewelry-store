import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import { getAuthConfig } from "../../utils/auth";

const WHATSAPP_NUMBER = "91XXXXXXXXXX"; // replace with your friend's number

function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/api/orders/${id}`, getAuthConfig());
      setOrder(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (!order) {
    return <div className="container page-shell">Loading order...</div>;
  }

  const buildWhatsAppMessage = () => {
    const itemsText = order.orderItems
      .map((item) => `• ${item.title} x ${item.quantity} = ₹${item.price * item.quantity}`)
      .join("\n");

    return `Hello ORNIVA, I have a question about my order.

Order ID: ${order._id}
Name: ${order.shippingAddress?.fullName || ""}
Phone: ${order.shippingAddress?.phone || ""}
City: ${order.shippingAddress?.city || ""}
State: ${order.shippingAddress?.state || ""}

Items:
${itemsText}

Total: ₹${order.totalPrice}`;
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const paymentLabel =
    order.paymentMethod === "cod"
      ? order.isPaid
        ? "COD marked paid"
        : "Cash on Delivery"
      : order.paymentMethod === "whatsapp"
      ? "WhatsApp order confirmation"
      : `${order.paymentMethod} · ${order.paymentStatus}`;

  return (
    <div className="page-shell">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Order placed</p>
            <h1 className="section-title">Order Details</h1>
          </div>
        </div>

        <div className="shop-layout">
          <div className="admin-section-card" style={{ marginTop: 0 }}>
            <h2 style={{ marginTop: 0 }}>Shipping</h2>
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.phone}</p>
            <p>
              {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2
                ? `, ${order.shippingAddress.addressLine2}`
                : ""}
            </p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
              {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>

            <h2 style={{ marginTop: "28px" }}>Items</h2>
            <div style={{ display: "grid", gap: "12px" }}>
              {order.orderItems.map((item) => (
                <div key={item.product} className="user-role-row">
                  <div>
                    <strong>{item.title}</strong>
                    <p style={{ margin: "6px 0 0", color: "#666" }}>
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <strong>₹{item.price * item.quantity}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="shop-sidebar">
            <h3 className="filter-title">Summary</h3>

            <div className="filter-list">
              <div className="filter-chip">Payment Method: {order.paymentMethod}</div>
              <div className="filter-chip">Order Status: {order.orderStatus}</div>
              <div className="filter-chip">Payment State: {paymentLabel}</div>
              <div className="filter-chip">Items: ₹{order.itemsPrice}</div>
              <div className="filter-chip">Shipping: ₹{order.shippingPrice}</div>
              <div className="filter-chip">Tax: ₹{order.taxPrice}</div>
              <div className="filter-chip active">Total: ₹{order.totalPrice}</div>
            </div>

            {order.isPaid && order.paidAt ? (
              <div style={{ marginTop: "16px", color: "#666", fontSize: "14px" }}>
                Paid on: {new Date(order.paidAt).toLocaleString()}
              </div>
            ) : null}

            <button
              className="btn-primary"
              type="button"
              onClick={openWhatsApp}
              style={{ marginTop: "18px", width: "100%", justifyContent: "center" }}
            >
              Contact on WhatsApp
            </button>

            <Link
              to="/shop"
              className="btn-secondary"
              style={{
                marginTop: "12px",
                width: "100%",
                justifyContent: "center",
                display: "inline-flex",
              }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;