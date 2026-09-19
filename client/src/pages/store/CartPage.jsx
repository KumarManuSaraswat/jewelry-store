import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { money } from "../../utils/store";
import OrderSummary from "../../components/OrderSummary";
import Icon from "../../components/Icon";
export default function CartPage() {
  const { cartItems, totals, updateCartQuantity, removeFromCart } = useCart();
  return (
    <div className="page-shell">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">GOOD CHOICES, BEAUTIFUL THINGS</p>
            <h1 className="section-title">Your shopping bag.</h1>
            <p className="section-subtitle">
              {totals.totalItems ? `${totals.totalItems} little ${totals.totalItems === 1 ? 'reason' : 'reasons'} to smile.` : 'There’s room for something lovely.'}
            </p>
          </div>
          <Link className="text-link" to="/shop">
            Keep exploring <Icon name="arrow" size={18} />
          </Link>
        </div>
        {!cartItems.length ? (
          <div className="empty-state">
            <Icon name="bag" size={40} />
            <h3>Your next favorite is waiting.</h3>
            <p>Find a piece you love and make it yours.</p>
            <Link to="/shop" className="btn-primary">
              Explore the collection
            </Link>
          </div>
        ) : (
          <div className="shop-layout">
            <div>
              <div className="shipping-progress">
                <p>
                  {totals.itemsPrice > 1999
                    ? "A little extra joy: your shipping is on us."
                    : `You’re ${money(2000 - totals.itemsPrice)} away from complimentary shipping.`}
                </p>
                <progress
                  aria-label="Progress towards free shipping"
                  value={Math.min(totals.itemsPrice, 2000)}
                  max="2000"
                />
              </div>
              {cartItems.map((item) => (
                <article className="bag-item" key={item.product}>
                  <Link to={"/product/" + item.slug}>
                    <img src={item.image} alt={item.title} />
                  </Link>
                  <div>
                    <h3>
                      <Link to={"/product/" + item.slug}>{item.title}</Link>
                    </h3>
                    <p>{money(item.price)}</p>
                    <div className="quantity-control">
                      <button
                        aria-label={"Decrease " + item.title + " quantity"}
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          updateCartQuantity(item.product, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        aria-label={"Increase " + item.title + " quantity"}
                        disabled={item.quantity >= item.countInStock}
                        onClick={() =>
                          updateCartQuantity(item.product, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="link-button"
                      onClick={() => removeFromCart(item.product)}
                    >
                      Remove
                    </button>
                  </div>
                  <strong>{money(item.price * item.quantity)}</strong>
                </article>
              ))}
            </div>
            <OrderSummary totals={totals}>
              <Link className="btn-primary" to="/checkout">
                Continue to checkout <Icon name="arrow" size={18} />
              </Link>
              <Link className="btn-secondary" to="/shop">
                Keep shopping
              </Link>
            </OrderSummary>
          </div>
        )}
      </div>
    </div>
  );
}
