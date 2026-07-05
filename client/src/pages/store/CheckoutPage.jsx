import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useCart } from "../../context/CartContext";
import { getAuthConfig } from "../../utils/auth";

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, totals, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    paymentMethod: "cod",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!cartItems.length) {
      alert("Your cart is empty");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
      };

      const { data } = await api.post("/orders", payload, getAuthConfig());

      clearCart();
      navigate(`/orders/${data._id}`);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Secure checkout</p>
            <h1 className="section-title">Place Your Order</h1>
          </div>
        </div>

        <form className="shop-layout" onSubmit={handlePlaceOrder}>
          <div className="admin-section-card" style={{ marginTop: 0 }}>
            <h2 style={{ marginTop: 0 }}>Shipping Information</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "14px",
              }}
            >
              <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
              <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
              <input name="addressLine1" placeholder="Address Line 1" value={formData.addressLine1} onChange={handleChange} required />
              <input name="addressLine2" placeholder="Address Line 2" value={formData.addressLine2} onChange={handleChange} />
              <input name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
              <input name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
              <input name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} required />
              <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} required />
            </div>

            <h2 style={{ marginTop: "28px" }}>Payment Method</h2>

            <div style={{ display: "grid", gap: "10px" }}>
              <label className="filter-chip">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === "cod"}
                  onChange={handleChange}
                />{" "}
                Cash on Delivery
              </label>

              <label className="filter-chip">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={formData.paymentMethod === "upi"}
                  onChange={handleChange}
                />{" "}
                UPI
              </label>

              <label className="filter-chip">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="razorpay"
                  checked={formData.paymentMethod === "razorpay"}
                  onChange={handleChange}
                />{" "}
                Razorpay
              </label>
            </div>
          </div>

          <div className="shop-sidebar">
            <h3 className="filter-title">Order Summary</h3>

            <div style={{ display: "grid", gap: "12px", marginBottom: "16px" }}>
              {cartItems.map((item) => (
                <div key={item.product} style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                  <span>
                    {item.title} × {item.quantity}
                  </span>
                  <strong>₹{item.price * item.quantity}</strong>
                </div>
              ))}
            </div>

            <div className="filter-list">
              <div className="filter-chip">Items: ₹{totals.itemsPrice}</div>
              <div className="filter-chip">Shipping: ₹{totals.shippingPrice}</div>
              <div className="filter-chip">Tax: ₹{totals.taxPrice}</div>
              <div className="filter-chip active">Total: ₹{totals.totalPrice}</div>
            </div>

            <button
              className="btn-primary"
              type="submit"
              style={{ marginTop: "18px", width: "100%", justifyContent: "center" }}
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;