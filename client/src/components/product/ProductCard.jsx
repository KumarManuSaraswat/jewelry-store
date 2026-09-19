import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { money, priceOf } from "../../utils/store";
import Icon from "../Icon";
export default function ProductCard({ product }) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const saved = wishlist.some((item) => item._id === product._id);
  return (
    <article className="product-card">
      <div className="product-media">
        <Link to={"/product/" + product.slug} className="product-image-link">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.title} loading="lazy" />
          ) : (
            <span className="image-unavailable">
              Orniva · Image coming soon
            </span>
          )}
        </Link>
        {(product.isBestSeller ||
          product.isNewArrival ||
          product.stock === 0) && (
          <span className="product-badge">
            {product.stock === 0
              ? "Sold out"
              : product.isBestSeller
                ? "Most loved"
                : "New arrival"}
          </span>
        )}
        <button
          className={"wishlist-button " + (saved ? "saved" : "")}
          aria-label={
            (saved ? "Remove " : "Save ") +
            product.title +
            (saved ? " from" : " to") +
            " wishlist"
          }
          aria-pressed={saved}
          onClick={() => toggleWishlist(product)}
        >
          <Icon name="heart" size={20} />
        </button>
        <button
          className="quick-add"
          disabled={product.stock < 1}
          onClick={() => addToCart(product)}
        >
          {product.stock > 0 ? (
            <>
              Add to bag <Icon name="plus" size={17} />
            </>
          ) : (
            "Currently unavailable"
          )}
        </button>
      </div>
      <div className="product-content">
        <p className="product-meta">
          {product.materials?.join(" · ") || product.category}
        </p>
        <h3>
          <Link to={"/product/" + product.slug}>{product.title}</Link>
        </h3>
        <div className="price-row">
          <span>{money(priceOf(product))}</span>
          {priceOf(product) < product.price && (
            <del>{money(product.price)}</del>
          )}
          {product.reviewCount > 0 && (
            <span className="product-rating">
              ★ {product.averageRating} <span>({product.reviewCount})</span>
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
