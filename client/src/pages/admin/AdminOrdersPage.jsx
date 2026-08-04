import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { getAuthConfig } from "../../utils/auth";

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [updatingId, setUpdatingId] = useState("");

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/api/orders", getAuthConfig());
      setOrders(data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, updates) => {
    try {
      setUpdatingId(orderId);
      await api.put(`/api/orders/${orderId}/status`, updates, getAuthConfig());
      await fetchOrders();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update order");
    } finally {
      setUpdatingId("");
    }
  };

  const getPaymentLabel = (order) => {
    if (order.paymentMethod === "razorpay") {
      return order.isPaid ? "Paid via Razorpay" : "Pending Razorpay payment";
    }

    if (order.paymentMethod === "cod") {
      return order.isPaid ? "COD paid" : "Cash on Delivery";
    }

    return `${order.paymentMethod} · ${order.paymentStatus}`;
  };

  return (
    <div>
      <h1>Order Management</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Manage payments, fulfillment, and delivery progress.
      </p>

      <div className="admin-section-card">
        {orders.length ? (
          orders.map((order) => (
            <div
              key={order._id}
              className="user-role-row"
              style={{
                alignItems: "flex-start",
                gap: "18px",
                paddingBlock: "16px",
                borderBottom: "1px solid #eee",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong>
                  Order #{order._id.slice(-6).toUpperCase()} ·{" "}
                  {order.user?.name || "Unknown User"} · ₹{order.totalPrice}
                </strong>

                <p style={{ margin: "6px 0 0", color: "#666" }}>
                  {order.user?.email || "No email"} · {order.orderItems.length} items ·{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

                <p style={{ margin: "6px 0 0", color: "#666" }}>
                  Payment Method: {order.paymentMethod}
                </p>

                <p style={{ margin: "6px 0 0", color: "#666" }}>
                  Payment: {getPaymentLabel(order)} · Order: {order.orderStatus}
                </p>

                {order.shippingAddress ? (
                  <p style={{ margin: "6px 0 0", color: "#666" }}>
                    Ship to: {order.shippingAddress.fullName}, {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state}
                  </p>
                ) : null}

                {order.razorpayPaymentId ? (
                  <p style={{ margin: "6px 0 0", color: "#666", fontSize: "14px" }}>
                    Razorpay Payment ID: {order.razorpayPaymentId}
                  </p>
                ) : null}
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  className="small-action-btn"
                  onClick={() => updateStatus(order._id, { orderStatus: "processing" })}
                  type="button"
                  disabled={updatingId === order._id}
                >
                  Processing
                </button>

                <button
                  className="small-action-btn"
                  onClick={() => updateStatus(order._id, { orderStatus: "shipped" })}
                  type="button"
                  disabled={updatingId === order._id}
                >
                  Shipped
                </button>

                <button
                  className="small-action-btn dark"
                  onClick={() =>
                    updateStatus(order._id, {
                      orderStatus: "delivered",
                      isDelivered: true,
                    })
                  }
                  type="button"
                  disabled={updatingId === order._id}
                >
                  Delivered
                </button>

                {!order.isPaid ? (
                  <button
                    className="small-action-btn"
                    onClick={() => updateStatus(order._id, { paymentStatus: "paid" })}
                    type="button"
                    disabled={updatingId === order._id}
                  >
                    Mark Paid
                  </button>
                ) : null}

                <button
                  className="small-action-btn"
                  onClick={() => updateStatus(order._id, { orderStatus: "cancelled" })}
                  type="button"
                  disabled={updatingId === order._id}
                >
                  Cancel
                </button>

                <Link
                  to={`/admin/orders/${order._id}`}
                  className="small-action-btn dark"
                  style={{ textDecoration: "none" }}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default AdminOrdersPage;