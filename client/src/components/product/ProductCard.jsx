import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const WHATSAPP_NUMBER = "917231932107";

function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart();

  const finalPrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const inStock = product.stock > 0;

  const cartPayload = {
    product: product._id,
    title: product.title,
    price: finalPrice,
    image: product.images?.[0] || "",
    quantity: 1,
    countInStock: product.stock || 0,
  };

  const handleWhatsAppOrder = () => {
    const message = `Hello ORNIVA, I want to order this product.

Product: ${product.title}
Price: ₹${finalPrice}
Category: ${product.category}

Please confirm availability and order details.`;

    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <article className="product-card">
      <div className="product-media">
        <div className="product-badges">
          {product.isNewArrival && <span className="badge badge-dark">NEW</span>}
          {product.isBestSeller && (
            <span className="badge badge-gold">BEST SELLER</span>
          )}
          {!inStock ? <span className="badge badge-dark">OUT OF STOCK</span> : null}
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

        <p style={{ marginTop: "6px", color: "#666", fontSize: "14px" }}>
          {inStock ? `Ready to ship · ${product.stock} in stock` : "Currently out of stock"}
        </p>

        <div className="product-actions-row">
          <button
            className="small-action-btn"
            type="button"
            onClick={handleWhatsAppOrder}
          >
            WhatsApp
          </button>

          <button
            className="small-action-btn dark"
            type="button"
            onClick={() => addToCart(cartPayload, 1)}
            disabled={!inStock}
            style={{ opacity: inStock ? 1 : 0.6, cursor: inStock ? "pointer" : "not-allowed" }}
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