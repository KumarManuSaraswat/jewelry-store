import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { getAuthConfig } from "../../utils/auth";

function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`, getAuthConfig());
        setOrder(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) {
    return <div className="container page-shell">Loading order...</div>;
  }

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
              {order.shippingAddress.addressLine1}, {order.shippingAddress.addressLine2}
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
              <div className="filter-chip">Payment: {order.paymentStatus}</div>
              <div className="filter-chip">Order: {order.orderStatus}</div>
              <div className="filter-chip">Items: ₹{order.itemsPrice}</div>
              <div className="filter-chip">Shipping: ₹{order.shippingPrice}</div>
              <div className="filter-chip">Tax: ₹{order.taxPrice}</div>
              <div className="filter-chip active">Total: ₹{order.totalPrice}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;