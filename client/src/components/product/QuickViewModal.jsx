import { Link } from "react-router-dom";

function QuickViewModal({ product, onClose }) {
  if (!product) return null;

  const finalPrice =
    product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <div className="quick-view-backdrop" onClick={onClose}>
      <div className="quick-view-modal" onClick={(e) => e.stopPropagation()}>
        <div className="quick-view-layout">
          <img
            src={
              product.images?.[0] ||
              "https://via.placeholder.com/900x1100/f1e8dc/2a241f?text=ORNIVA"
            }
            alt={product.title}
            className="quick-view-image"
          />

          <div className="quick-view-content">
            <button className="quick-view-close" onClick={onClose} type="button">
              Close
            </button>

            <p className="product-category">{product.category}</p>
            <h2 className="product-page-title" style={{ fontSize: "42px" }}>
              {product.title}
            </h2>

            <div className="product-price-row">
              <span className="product-current-price">₹{finalPrice}</span>
              {product.discountPrice > 0 && (
                <span className="product-old-price">₹{product.price}</span>
              )}
            </div>

            <p className="product-description">
              {product.description ||
                "A signature ORNIVA piece designed for elegant daily wear."}
            </p>

            <div className="product-trust-list">
              <div className="product-trust-item">18k gold-plated finish</div>
              <div className="product-trust-item">Hand-finished detailing</div>
              <div className="product-trust-item">30-day easy returns</div>
            </div>

            <div className="product-actions">
              <button className="btn-primary" type="button">
                Add to Bag
              </button>
              <Link to={`/product/${product.slug}`} className="btn-secondary" onClick={onClose}>
                View full product
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickViewModal;