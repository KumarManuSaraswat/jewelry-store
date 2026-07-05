import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();

  const finalPrice =
    product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <article className="product-card">
      <div className="product-media">
        <div className="product-badges">
          {product.isNewArrival && <span className="badge badge-dark">NEW</span>}
          {product.isBestSeller && (
            <span className="badge badge-gold">BEST SELLER</span>
          )}
        </div>

        <img
          src={
            product.images?.[0] ||
            "https://via.placeholder.com/600x700/f1e8dc/2a241f?text=ORNIVA"
          }
          alt={product.title}
        />
      </div>

      <div className="product-content">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-meta">
          {product.averageRating || 4.8}★ · {product.category}
        </p>

        <div className="price-row">
          <span className="price">₹{finalPrice}</span>
          {product.discountPrice > 0 && (
            <span className="old-price">₹{product.price}</span>
          )}
        </div>

        <div className="product-actions-row">
          <button className="small-action-btn" type="button">
            Wishlist
          </button>
          <button
            className="small-action-btn dark"
            type="button"
            onClick={() => addToCart(product, 1)}
          >
            Add to Bag
          </button>
          <button
            className="small-action-btn"
            type="button"
            onClick={() => onQuickView?.(product)}
          >
            Quick View
          </button>
        </div>

        <div style={{ marginTop: "14px" }}>
          <Link to={`/product/${product.slug}`} className="product-link">
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;