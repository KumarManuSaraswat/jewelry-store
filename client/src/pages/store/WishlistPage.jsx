import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import ProductCard from "../../components/product/ProductCard";
import Icon from "../../components/Icon";
export default function WishlistPage() {
  const { wishlist } = useCart();
  return (
    <div className="page-shell">
      <div className="container">
        <div className="shop-heading">
          <p className="eyebrow">FOR NOW. FOR LATER. FOR YOU.</p>
          <h1>Your little love list.</h1>
          <p>Your saved pieces, kept on this device until you’re ready.</p>
        </div>
        {wishlist.length ? (
          <div className="product-grid">
            {wishlist.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Icon name="heart" size={40} />
            <h3>Save a little sparkle.</h3>
            <p>Tap the heart on a piece you love to find it here later.</p>
            <Link className="btn-primary" to="/shop">
              Find your favorites
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
