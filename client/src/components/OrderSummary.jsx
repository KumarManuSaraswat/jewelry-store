import { money } from "../utils/store";
export default function OrderSummary({ totals, children }) {
  return (
    <aside className="summary-card">
      <h2>The lovely little details.</h2>
      <div className="summary-row">
        <span>Subtotal</span>
        <span>{money(totals.itemsPrice)}</span>
      </div>
      <div className="summary-row">
        <span>Shipping</span>
        <span>
          {totals.shippingPrice ? money(totals.shippingPrice) : "Complimentary"}
        </span>
      </div>
      <div className="summary-row">
        <span>Tax (3%)</span>
        <span>{money(totals.taxPrice)}</span>
      </div>
      <div className="summary-row summary-total">
        <strong>Total</strong>
        <strong>{money(totals.totalPrice)}</strong>
      </div>
      {children}
      <p className="summary-note">
        30-day easy returns. Questions? We’re just a message away.
      </p>
    </aside>
  );
}
