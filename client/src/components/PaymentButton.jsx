import { useState } from "react";
import api from "../api/axios";
import loadRazorpay from "../utils/loadRazorpay";
import { money } from "../utils/store";
export default function PaymentButton({ order, onPaid }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function pay() {
    setBusy(true);
    setError("");
    try {
      if (!(await loadRazorpay()))
        throw new Error(
          "Unable to load secure payment. Please check your connection and try again.",
        );
      const { data } = await api.post(
        "/api/orders/" + order._id + "/create-razorpay-order",
      );
      const checkout = new window.Razorpay({
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpayOrderId,
        name: "Orniva",
        description: "Order #" + order._id.slice(-6).toUpperCase(),
        prefill: data.customer,
        theme: { color: "#482b3c" },
        modal: { ondismiss: () => setBusy(false) },
        handler: async (result) => {
          try {
            const { data: verified } = await api.post(
              "/api/orders/" + order._id + "/verify-razorpay-payment",
              result,
            );
            onPaid(verified.order);
          } catch (err) {
            setError(
              err.response?.data?.message ||
                "Payment confirmation is still pending. Please contact Orniva before trying another payment.",
            );
          } finally {
            setBusy(false);
          }
        },
      });
      checkout.on("payment.failed", () => {
        setError(
          "The payment was not completed. Your order is saved and you can try again.",
        );
        setBusy(false);
      });
      checkout.open();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setBusy(false);
    }
  }
  return (
    <>
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      <button className="btn-primary" onClick={pay} disabled={busy}>
        {busy
          ? "Opening secure payment…"
          : "Pay securely · " + money(order.totalPrice)}
      </button>
      <p className="summary-note">
        UPI, cards, and other available methods through Razorpay. Payment
        details are handled by Razorpay.
      </p>
    </>
  );
}
