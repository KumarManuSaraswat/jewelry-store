import { useEffect, useState } from "react";
import api from "../../api/axios";
import { getAuthConfig } from "../../utils/auth";

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await api.get("/orders/my-orders", getAuthConfig());
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMyOrders();
  }, []);

  return (
    <div className="container page-shell">
      <h1>My Orders</h1>

      <div className="admin-section-card" style={{ marginTop: "20px" }}>
        {orders.length ? (
          orders.map((order) => (
            <div key={order._id} className="user-role-row">
              <div>
                <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
                <p style={{ margin: "6px 0 0", color: "#666" }}>
                  {new Date(order.createdAt).toLocaleDateString()} · ₹{order.totalPrice}
                </p>
                <p style={{ margin: "6px 0 0", color: "#666" }}>
                  Payment: {order.paymentStatus} · Status: {order.orderStatus}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No orders yet.</p>
        )}
      </div>
    </div>
  );
}

export default MyOrdersPage;