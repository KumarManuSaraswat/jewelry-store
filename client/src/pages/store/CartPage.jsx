import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function CartPage() {
  const navigate = useNavigate();
  const { cartItems, updateCartQuantity, removeFromCart, totals } = useCart();

  const totalUnits = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="page-shell">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Shopping bag</p>
            <h1 className="section-title">Your Cart</h1>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="admin-section-card">
            <p>Your cart is empty.</p>
            <Link to="/shop" className="btn-primary">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="shop-layout">
            <div className="admin-section-card" style={{ marginTop: 0 }}>
              {cartItems.map((item) => (
                <div key={item.product} className="user-role-row">
                  <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                    <img
                      src={
                        item.image ||
                        "https://via.placeholder.com/90x110/f1e8dc/2a241f?text=ORNIVA"
                      }
                      alt={item.title}
                      style={{
                        width: "78px",
                        height: "96px",
                        objectFit: "cover",
                        borderRadius: "14px",
                        border: "1px solid #eee",
                      }}
                    />

                    <div>
                      <strong>{item.title}</strong>
                      <p style={{ margin: "6px 0 0", color: "#666" }}>₹{item.price}</p>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      className="small-action-btn"
                      type="button"
                      onClick={() =>
                        updateCartQuantity(item.product, Math.max(1, item.quantity - 1))
                      }
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      className="small-action-btn"
                      type="button"
                      onClick={() =>
                        updateCartQuantity(
                          item.product,
                          Math.min(item.countInStock || 99, item.quantity + 1)
                        )
                      }
                    >
                      +
                    </button>

                    <button
                      className="small-action-btn"
                      type="button"
                      onClick={() => removeFromCart(item.product)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="shop-sidebar">
              <h3 className="filter-title">Order Summary</h3>

              <div style={{ marginBottom: "14px", color: "#666" }}>
                {totalUnits} item{totalUnits > 1 ? "s" : ""} in your bag
              </div>

              <div className="filter-list">
                <div className="filter-chip">Items: ₹{totals.itemsPrice}</div>
                <div className="filter-chip">Shipping: ₹{totals.shippingPrice}</div>
                <div className="filter-chip">Tax: ₹{totals.taxPrice}</div>
                <div className="filter-chip active">Total: ₹{totals.totalPrice}</div>
              </div>

              <button
                className="btn-primary"
                type="button"
                style={{ marginTop: "18px", width: "100%", justifyContent: "center" }}
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
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
        )}
      </div>
    </div>
  );
}

export default CartPage;