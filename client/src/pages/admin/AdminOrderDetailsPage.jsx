import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { getAuthConfig } from "../../utils/auth";

const WHATSAPP_NUMBER = "917231932107";

function AdminOrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/api/orders/${id}`, getAuthConfig());
        setOrder(data);
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Failed to load order details");
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) return <div>Loading order details...</div>;

  const openCustomerWhatsApp = () => {
    const itemsText = order.orderItems
      .map((item) => `• ${item.title} x ${item.quantity}`)
      .join("\n");

    const message = `Hello ${order.shippingAddress?.fullName || "customer"}, 
regarding your ORNIVA order:

Order ID: ${order._id}
Items:
${itemsText}

Total: ₹${order.totalPrice}

Please reply if you need any changes or have any questions.`;

    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <div className="section-head" style={{ marginBottom: "24px" }}>
        <div>
          <p className="eyebrow">Admin view</p>
          <h1 className="section-title">
            Order #{order._id.slice(-6).toUpperCase()}
          </h1>
        </div>
      </div>

      <div className="admin-section-card">
        <h3>Customer</h3>
        <p>
          <strong>Name:</strong> {order.user?.name || order.shippingAddress?.fullName}
        </p>
        <p><strong>Email:</strong> {order.user?.email || "No email"}</p>
        <p><strong>Phone:</strong> {order.shippingAddress?.phone}</p>

        <button
          type="button"
          className="btn-primary"
          onClick={openCustomerWhatsApp}
          style={{ marginTop: "12px" }}
        >
          WhatsApp Customer
        </button>
      </div>

      <div className="admin-section-card">
        <h3>Shipping Address</h3>
        <p>{order.shippingAddress?.fullName}</p>
        <p>{order.shippingAddress?.phone}</p>
        <p>{order.shippingAddress?.addressLine1}</p>
        {order.shippingAddress?.addressLine2 ? <p>{order.shippingAddress.addressLine2}</p> : null}
        <p>
          {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
          {order.shippingAddress?.postalCode}
        </p>
        <p>{order.shippingAddress?.country}</p>
      </div>

      <div className="admin-section-card">
        <h3>Order Info</h3>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
        <p><strong>Order Status:</strong> {order.orderStatus}</p>
        <p><strong>Total:</strong> ₹{order.totalPrice}</p>
      </div>

      <div className="admin-section-card">
        <h3>Items</h3>
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
    </div>
  );
}

export default AdminOrderDetailsPage;