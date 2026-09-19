import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useCart } from "../../context/CartContext";
import OrderSummary from "../../components/OrderSummary";
import { money } from "../../utils/store";
const fields = [
  ["fullName", "Full name", "name"],
  ["phone", "Phone number", "tel"],
  ["addressLine1", "Street address", "address-line1"],
  ["addressLine2", "Apartment, landmark (optional)", "address-line2"],
  ["city", "City", "address-level2"],
  ["state", "State", "address-level1"],
  ["postalCode", "PIN code", "postal-code"],
];
export default function CheckoutPage() {
  const { cartItems, totals, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
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
  const [error, setError] = useState("");
  const [onlinePayment, setOnlinePayment] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/api/store/config", { signal: controller.signal })
      .then(({ data }) => setOnlinePayment(data.onlinePayment === true))
      .catch(() => {});
    return () => controller.abort();
  }, []);
  const requestId = useRef(crypto.randomUUID());
  async function placeOrder(e) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const { paymentMethod, ...shippingAddress } = form;
      const { data } = await api.post("/api/orders", {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod,
        requestId: requestId.current,
      });
      clearCart();
      navigate("/orders/" + data._id);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "We couldn’t place your order. Your bag is saved. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }
  if (!cartItems.length)
    return (
      <div className="page-shell container">
        <div className="empty-state">
          <h1>Your bag needs a little love.</h1>
          <Link to="/shop" className="btn-primary">
            Find your favorites
          </Link>
        </div>
      </div>
    );
  return (
    <div className="page-shell">
      <div className="container">
        <p className="checkout-step">
          <Link to="/cart">01 BAG</Link> &nbsp; / &nbsp; 02 DETAILS &nbsp; /
          &nbsp; 03 CONFIRMATION
        </p>
        <div className="section-head">
          <div>
            <p className="eyebrow">ALMOST YOURS</p>
            <h1 className="section-title">A little closer to you.</h1>
          </div>
        </div>
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        <form className="checkout-layout" onSubmit={placeOrder}>
          <div>
            <section className="checkout-section">
              <h2>Where should the joy arrive?</h2>
              <div className="form-grid">
                {fields.map(([name, label, autoComplete]) => (
                  <label key={name}>
                    {label}
                    <input
                      name={name}
                      autoComplete={autoComplete}
                      type={name === "phone" ? "tel" : "text"}
                      inputMode={
                        ["phone", "postalCode"].includes(name)
                          ? "numeric"
                          : undefined
                      }
                      pattern={
                        name === "phone"
                          ? "[+]?[0-9 ()-]{10,16}"
                          : name === "postalCode"
                            ? "[1-9][0-9]{5}"
                            : undefined
                      }
                      maxLength={name === "postalCode" ? 6 : 200}
                      required={name !== "addressLine2"}
                      value={form[name]}
                      onChange={(e) =>
                        setForm({ ...form, [name]: e.target.value })
                      }
                    />
                  </label>
                ))}
                <label>
                  Country
                  <input value="India" readOnly autoComplete="country-name" />
                </label>
              </div>
            </section>
            <section className="checkout-section">
              <h2>How would you like to pay?</h2>
              <div className="form-stack">
                {onlinePayment && (
                  <label className="payment-choice">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={form.paymentMethod === "razorpay"}
                      onChange={() =>
                        setForm({ ...form, paymentMethod: "razorpay" })
                      }
                    />
                    <span>
                      UPI / Cards / Net banking
                      <small>
                        Complete secure payment on the next screen with
                        Razorpay.
                      </small>
                    </span>
                  </label>
                )}
                {[
                  ["cod", "Cash on delivery", "Pay when your order arrives."],
                  [
                    "whatsapp",
                    "Arrange with Orniva on WhatsApp",
                    "Place your order, then contact our team to confirm payment.",
                  ],
                ].map(([value, title, note]) => (
                  <label className="payment-choice" key={value}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={value}
                      checked={form.paymentMethod === value}
                      onChange={(e) =>
                        setForm({ ...form, paymentMethod: e.target.value })
                      }
                    />
                    <span>
                      {title}
                      <small>{note}</small>
                    </span>
                  </label>
                ))}
              </div>
            </section>
            <p className="summary-note">
              Please review your details before placing your order.{" "}
              <Link to="/shipping-returns" className="link-button">
                Shipping & returns
              </Link>
            </p>
          </div>
          <OrderSummary totals={totals}>
            <div>
              {cartItems.map((item) => (
                <div className="summary-row" key={item.product}>
                  <span>
                    {item.title} × {item.quantity}
                  </span>
                  <span>{money(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading
                ? "Placing your order…"
                : "Place order · " + money(totals.totalPrice)}
            </button>
            <p className="summary-note">
              Availability and final prices are checked when your order is
              placed.
            </p>
          </OrderSummary>
        </form>
      </div>
    </div>
  );
}
