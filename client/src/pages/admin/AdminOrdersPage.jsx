import { useEffect, useState } from "react";
import api from "../../api/axios";
import { getAuthConfig } from "../../utils/auth";

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/api/orders", getAuthConfig());
      setOrders(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, updates) => {
    try {
      await api.put(`/orders/${orderId}/status`, updates, getAuthConfig());
      fetchOrders();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update order");
    }
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
            <div key={order._id} className="user-role-row">
              <div>
                <strong>
                  {order.user?.name || "Unknown User"} · ₹{order.totalPrice}
                </strong>
                <p style={{ margin: "6px 0 0", color: "#666" }}>
                  {order.user?.email} · {order.orderItems.length} items ·{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p style={{ margin: "6px 0 0", color: "#666" }}>
                  Payment: {order.paymentStatus} · Order: {order.orderStatus}
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  className="small-action-btn"
                  onClick={() =>
                    updateStatus(order._id, { orderStatus: "processing" })
                  }
                  type="button"
                >
                  Processing
                </button>
                <button
                  className="small-action-btn"
                  onClick={() =>
                    updateStatus(order._id, { orderStatus: "shipped" })
                  }
                  type="button"
                >
                  Shipped
                </button>
                <button
                  className="small-action-btn dark"
                  onClick={() =>
                    updateStatus(order._id, { orderStatus: "delivered" })
                  }
                  type="button"
                >
                  Delivered
                </button>
                <button
                  className="small-action-btn"
                  onClick={() =>
                    updateStatus(order._id, { paymentStatus: "paid" })
                  }
                  type="button"
                >
                  Mark Paid
                </button>
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