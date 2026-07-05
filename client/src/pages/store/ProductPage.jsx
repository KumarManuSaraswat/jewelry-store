import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { useCart } from "../../context/CartContext";

function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [slug]);

  if (!product) return <p className="container page-shell">Loading product...</p>;

  const finalPrice =
    product.discountPrice > 0 ? product.discountPrice : product.price;

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

            <p className="product-description">
              {product.description}
            </p>

            <div className="product-trust-list">
              <div className="product-trust-item">18k gold-plated finish</div>
              <div className="product-trust-item">Hand-finished for everyday elegance</div>
              <div className="product-trust-item">30-day easy returns</div>
              <div className="product-trust-item">
                {product.stock > 0 ? `Ready to ship · ${product.stock} in stock` : "Currently out of stock"}
              </div>
            </div>

            <div className="product-actions">
              <button className="btn-primary" type="button" onClick={() => addToCart(product, 1)}>
                Add to Bag
              </button>
              <button className="btn-secondary" type="button">
                Add to Wishlist
              </button>
            </div>

            <div className="product-meta-grid">
              <div className="product-meta-box">
                <span>Material</span>
                <strong>
                  {product.materials?.length ? product.materials.join(", ") : "Gold-plated finish"}
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