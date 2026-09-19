import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axios";
import { useCart } from "../../context/CartContext";
import { money, priceOf, whatsapp } from "../../utils/store";
import Icon from "../../components/Icon";
import ProductCard from "../../components/product/ProductCard";
export default function ProductPage() {
  const { slug } = useParams();
  const [state, setState] = useState({ product: null, error: "", related: [] });
  const [selected, setSelected] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, wishlist, toggleWishlist } = useCart();
  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/api/products/" + slug, { signal: controller.signal })
      .then(async ({ data }) => {
        setState({ product: data, error: "", related: [] });
        const related = await api.get(
          "/api/products?category=" + data.category,
          { signal: controller.signal },
        );
        setState({
          product: data,
          error: "",
          related: related.data.filter((p) => p._id !== data._id).slice(0, 4),
        });
      })
      .catch((err) => {
        if (err.code !== "ERR_CANCELED")
          setState((s) =>
            s.product
              ? s
              : {
                  ...s,
                  error:
                    err.response?.status === 404
                      ? "This piece is no longer available."
                      : "We couldn’t load this piece. Please try again.",
                },
          );
      });
    return () => controller.abort();
  }, [slug]);
  const { product, error, related } = state;
  if (error)
    return (
      <div className="container page-shell">
        <div className="empty-state" role="alert">
          <h1>A little pause.</h1>
          <p>{error}</p>
          <Link className="btn-primary" to="/shop">
            Explore the collection
          </Link>
        </div>
      </div>
    );
  if (!product)
    return (
      <div className="container page-shell" role="status">
        Finding your piece…
      </div>
    );
  const saved = wishlist.some((p) => p._id === product._id);
  return (
    <div className="page-shell">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link> /{" "}
          <Link to={"/shop?category=" + product.category}>
            {product.category}
          </Link>{" "}
          / <span>{product.title}</span>
        </nav>
        <section className="product-page">
          <div>
            {product.images?.length ? (
              <>
                <img
                  className="product-gallery-main"
                  src={product.images[selected] || product.images[0]}
                  alt={product.title}
                />
                <div className="gallery-thumbs">
                  {product.images.map((src, i) => (
                    <button
                      key={src + i}
                      onClick={() => setSelected(i)}
                      className={selected === i ? "active" : ""}
                      aria-label={"View image " + (i + 1)}
                      aria-pressed={selected === i}
                    >
                      <img
                        src={src}
                        alt={product.title + " detail " + (i + 1)}
                      />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="product-gallery-main image-unavailable">
                Image coming soon
              </div>
            )}
          </div>
          <div className="product-info-card">
            <p className="eyebrow">{product.category} · ORNIVA</p>
            <h1 className="product-page-title">{product.title}</h1>
            {product.reviewCount > 0 && (
              <p className="product-meta">
                ★ {product.averageRating} · {product.reviewCount} customer
                reviews
              </p>
            )}
            <div className="product-price-row">
              <span className="product-current-price">
                {money(priceOf(product))}
              </span>
              {priceOf(product) < product.price && (
                <del className="product-old-price">{money(product.price)}</del>
              )}
            </div>
            <p className="summary-note">
              Shipping and 3% tax calculated at checkout.
            </p>
            <p className="product-description">{product.description}</p>
            <p className="stock-line">
              {product.stock > 0
                ? product.stock <= 5
                  ? `Just ${product.stock} ${product.stock === 1 ? "piece" : "pieces"} available`
                  : "In stock · Ready for your everyday"
                : "Currently sold out"}
            </p>
            <div className="product-actions">
              <div className="quantity-control">
                <button
                  aria-label="Decrease quantity"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity === 1}
                >
                  <Icon name="minus" size={15} />
                </button>
                <span aria-live="polite">{quantity}</span>
                <button
                  aria-label="Increase quantity"
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  disabled={quantity >= product.stock}
                >
                  <Icon name="plus" size={15} />
                </button>
              </div>
              <button
                className="btn-primary"
                disabled={product.stock < 1}
                onClick={() => addToCart(product, quantity)}
              >
                {product.stock > 0 ? "Add to bag" : "Sold out"}{" "}
                <Icon name="bag" size={19} />
              </button>
              <button
                className="icon-button"
                aria-pressed={saved}
                aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
                onClick={() => toggleWishlist(product)}
              >
                <Icon name="heart" fill={saved ? "currentColor" : "none"} />
              </button>
            </div>
            <a
              className="product-support"
              target="_blank"
              rel="noreferrer"
              href={whatsapp(
                "Hello ORNIVA, I’m interested in " +
                  product.title +
                  " (" +
                  money(priceOf(product)) +
                  "). Please help me with availability and details.",
              )}
            >
              Need a little help? Ask us on WhatsApp
            </a>
            <div className="product-assurances">
              <span>
                <Icon name="truck" size={19} /> Free shipping over ₹1,999
              </span>
              <span>
                <Icon name="return" size={19} /> 30-day returns
              </span>
            </div>
            <div className="product-information">
              <details open>
                <summary>The little details</summary>
                <p>
                  {product.materials?.length
                    ? product.materials.join(" · ")
                    : "Ask our team for material and sizing details for this piece."}
                </p>
              </details>
              <details>
                <summary>Jewelry care</summary>
                <p>
                  Keep your piece dry, avoid direct contact with perfume and
                  lotions, and store separately in a soft pouch. A gentle wipe
                  with a soft cloth keeps it looking its best.
                </p>
                <Link className="text-link" to="/care">
                  Our care guide
                </Link>
              </details>
              <details>
                <summary>Shipping & returns</summary>
                <p>
                  Complimentary shipping on orders over ₹1,999. Shipping is ₹99
                  on other orders. Our 30-day easy returns promise applies;
                  contact us with your order number for help.
                </p>
                <Link className="text-link" to="/shipping-returns">
                  Learn more
                </Link>
              </details>
            </div>
          </div>
        </section>
        {related.length > 0 && (
          <section className="section">
            <div className="section-head">
              <h2>
                A little more <em>you.</em>
              </h2>
              <Link to="/shop" className="text-link">
                Explore all
              </Link>
            </div>
            <div className="product-grid">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
