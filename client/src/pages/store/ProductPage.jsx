import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { useCart } from "../../context/CartContext";

const WHATSAPP_NUMBER = "917231932107";

function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/api/products/${slug}`);
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [slug]);

  if (!product) return <p className="container page-shell">Loading product...</p>;

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

  const buildWhatsAppMessage = () => {
    return `Hello ORNIVA, I want to order this product.

Product: ${product.title}
Price: ₹${finalPrice}
Category: ${product.category}

Please confirm availability and order details.`;
  };

  const openWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(buildWhatsAppMessage())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleAddToBag = () => {
    if (!inStock) return;
    setAdding(true);
    addToCart(cartPayload, 1);
    setTimeout(() => setAdding(false), 800);
  };

  const handleBuyNow = () => {
    if (!inStock) return;
    addToCart(cartPayload, 1);
    navigate("/checkout");
  };

  return (
    <div className="page-shell">
      <div className="container">
        <section className="product-page">
          <div className="product-gallery-card">
            <img
              src={
                product.images?.[0] ||
                "https://via.placeholder.com/900x1100/f1e8dc/2b221b?text=ORNIVA"
              }
              alt={product.title}
              className="product-gallery-main"
            />
          </div>

          <div className="product-info-card">
            <p className="product-category">{product.category}</p>
            <h1 className="product-page-title">{product.title}</h1>

            <p className="rating-line">
              {product.averageRating ? `${product.averageRating}★ rating` : "4.8★ rating"} ·{" "}
              {product.reviewCount ? `${product.reviewCount} reviews` : "Loved by customers"}
            </p>

            <div className="product-price-row">
              <span className="product-current-price">₹{finalPrice}</span>
              {product.discountPrice > 0 && (
                <span className="product-old-price">₹{product.price}</span>
              )}
            </div>

            <p className="product-description">{product.description}</p>

            <div className="product-trust-list">
              <div className="product-trust-item">18k gold-plated finish</div>
              <div className="product-trust-item">Hand-finished for everyday elegance</div>
              <div className="product-trust-item">30-day easy returns</div>
              <div className="product-trust-item">
                {inStock ? `Ready to ship · ${product.stock} in stock` : "Currently out of stock"}
              </div>
            </div>

            <div className="product-actions">
              <button
                className="btn-primary"
                type="button"
                onClick={handleAddToBag}
                disabled={!inStock}
                style={{ opacity: inStock ? 1 : 0.6, cursor: inStock ? "pointer" : "not-allowed" }}
              >
                {!inStock ? "Out of Stock" : adding ? "Added to Bag" : "Add to Bag"}
              </button>

              <button
                className="btn-secondary"
                type="button"
                onClick={handleBuyNow}
                disabled={!inStock}
                style={{ opacity: inStock ? 1 : 0.6, cursor: inStock ? "pointer" : "not-allowed" }}
              >
                Buy Now
              </button>
            </div>

            <div className="product-actions" style={{ marginTop: "12px" }}>
              <button
                className="small-action-btn dark"
                type="button"
                onClick={openWhatsApp}
              >
                Order on WhatsApp
              </button>
            </div>

            <div className="product-meta-grid">
              <div className="product-meta-box">
                <span>Material</span>
                <strong>
                  {product.materials?.length
                    ? product.materials.join(", ")
                    : "Gold-plated finish"}
                </strong>
              </div>

              <div className="product-meta-box">
                <span>Category</span>
                <strong>{product.category}</strong>
              </div>

              <div className="product-meta-box">
                <span>Shipping</span>
                <strong>Free above ₹1999</strong>
              </div>

              <div className="product-meta-box">
                <span>Returns</span>
                <strong>30-day easy returns</strong>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProductPage;