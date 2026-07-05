import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import ProductCard from "../../components/product/ProductCard";
import QuickViewModal from "../../components/product/QuickViewModal";

const categories = [
  {
    label: "Earrings",
    value: "earrings",
    image:
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Bracelets",
    value: "bracelets",
    image:
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Necklaces",
    value: "necklaces",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Rings",
    value: "rings",
    image:
      "https://images.unsplash.com/photo-1603561596112-db7f8f72b2e4?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Anklets",
    value: "anklets",
    image:
      "https://images.unsplash.com/photo-1611107683227-e9060eccd846?auto=format&fit=crop&w=900&q=80",
  },
];

const testimonials = [
  {
    quote:
      "I haven't taken off my Luna Pearl Drops in three months. They still look flawless.",
    name: "Sophia R.",
    role: "Verified Buyer",
    initial: "S",
  },
  {
    quote:
      "The packaging alone feels premium. ORNIVA genuinely looks like a brand triple the price.",
    name: "Amaya K.",
    role: "Verified Buyer",
    initial: "A",
  },
  {
    quote:
      "Finally, gold-toned jewelry that feels elegant and actually lasts through daily wear.",
    name: "Léa M.",
    role: "Verified Buyer",
    initial: "L",
  },
];

const whyItems = [
  {
    icon: "✦",
    title: "Premium Quality",
    text: "Hand-finished pieces using elevated materials and polished finishing details.",
  },
  {
    icon: "₹",
    title: "Affordable Luxury",
    text: "Elegant design language without the markup of traditional luxury retail.",
  },
  {
    icon: "✓",
    title: "Secure Payments",
    text: "A trustworthy checkout flow with familiar payment methods customers already use.",
  },
  {
    icon: "➜",
    title: "Fast Shipping",
    text: "Quick dispatch and gift-worthy packaging designed to feel special on arrival.",
  },
  {
    icon: "↺",
    title: "Easy Returns",
    text: "A simple returns promise that makes first-time orders feel safer and easier.",
  },
  {
    icon: "♡",
    title: "Concierge Support",
    text: "Helpful human support for sizing, gifting, shipping, and product questions.",
  },
];

const instaItems = [
  {
    title: "Luna Pearl Drops",
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Étoile Diamond Bracelet",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Amoré Heart Pendant",
    image:
      "https://images.unsplash.com/photo-1617038260846-9c7f5f7dc0d5?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Aria Solitaire Ring",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Halo Hoops",
    image:
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Soleil Chain Anklet",
    image:
      "https://images.unsplash.com/photo-1617038260732-48e5eac52328?auto=format&fit=crop&w=900&q=80",
  },
];

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featuredRes, newRes, bestRes] = await Promise.all([
          api.get("/products?isFeatured=true&limit=4"),
          api.get("/products?isNewArrival=true&limit=4"),
          api.get("/products?isBestSeller=true&limit=4"),
        ]);

        setFeaturedProducts(featuredRes.data);
        setNewArrivals(newRes.data);
        setBestSellers(bestRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHomeData();
  }, []);

  const heroProduct = featuredProducts[0];

  const renderGrid = (products) => (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onQuickView={setQuickViewProduct}
        />
      ))}
    </div>
  );

  return (
    <div className="page-shell">
      <div className="container">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">New season · 2026 collection</p>
            <h1>Elegance you can wear every day.</h1>
            <p>
              Discover timeless jewelry crafted in 18k gold-plated detail —
              designed to be layered, loved, and styled from everyday mornings
              to special evenings.
            </p>

            <div className="hero-actions">
              <Link to="/shop" className="btn-primary">
                Shop Now
              </Link>
              <Link to="/shop" className="btn-secondary">
                Explore Collection
              </Link>
            </div>
          </div>

          <div className="hero-card">
            <img
              src={
                heroProduct?.images?.[0] ||
                "https://via.placeholder.com/700x900/f3e9dd/2d241b?text=ORNIVA+COLLECTION"
              }
              alt={heroProduct?.title || "Featured jewelry"}
            />

            <div className="hero-card-content">
              <p className="eyebrow">Featured</p>
              <h3>{heroProduct?.title || "Luna Pearl Drops"}</h3>
              <p>
                {heroProduct?.description ||
                  "A polished everyday essential with a luminous finish and soft statement feel."}
              </p>
              <strong>
                ₹
                {heroProduct
                  ? heroProduct.discountPrice > 0
                    ? heroProduct.discountPrice
                    : heroProduct.price
                  : 2499}
              </strong>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <p className="eyebrow">Shop by category</p>
              <h2 className="section-title">Curated essentials</h2>
            </div>
            <Link to="/shop" className="product-link">
              View all
            </Link>
          </div>

          <div className="category-tiles">
            {categories.map((category) => (
              <Link
                key={category.value}
                to={`/shop?category=${category.value}`}
                className="category-tile"
              >
                <img src={category.image} alt={category.label} />
                <div className="category-overlay">
                  <span>{category.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <p className="eyebrow">Fresh from the studio</p>
              <h2 className="section-title">New Arrivals</h2>
            </div>
            <Link to="/shop" className="product-link">
              See all new
            </Link>
          </div>
          {renderGrid(newArrivals)}
        </section>

        <section className="promise-section">
          <div className="promise-card">
            <img
              src={
                featuredProducts[0]?.images?.[0] ||
                "https://via.placeholder.com/900x700/f0e6da/2b241d?text=THE+ORNIVA+PROMISE"
              }
              alt="The ORNIVA Promise"
              className="promise-image"
            />

            <div className="promise-copy">
              <p className="eyebrow">The ORNIVA Promise</p>
              <h2>Crafted to be worn, designed to be remembered.</h2>
              <p>
                Every ORNIVA piece is made to feel elevated, giftable, and easy
                to wear every day — with a premium finish and enduring design language.
              </p>

              <div className="promise-points">
                <span className="promise-pill">18k Gold Plated</span>
                <span className="promise-pill">Hand Finished</span>
                <span className="promise-pill">30-Day Returns</span>
              </div>

              <button type="button" className="btn-primary">
                Our Story
              </button>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <p className="eyebrow">Why ORNIVA</p>
              <h2 className="section-title">The little things, done beautifully.</h2>
            </div>
          </div>

          <div className="why-grid">
            {whyItems.map((item) => (
              <article key={item.title} className="why-card">
                <div className="why-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <p className="eyebrow">Most loved</p>
              <h2 className="section-title">Best Sellers</h2>
            </div>
            <Link to="/shop" className="product-link">
              All best sellers
            </Link>
          </div>
          {renderGrid(bestSellers)}
        </section>

        <section className="community-section">
          <div className="section-head">
            <div>
              <p className="eyebrow">Loved worldwide</p>
              <h2 className="section-title">From our community</h2>
            </div>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <article key={item.name} className="testimonial-card">
                <p className="testimonial-quote">“</p>
                <p className="testimonial-text">{item.quote}</p>

                <div className="testimonial-user">
                  <div className="testimonial-avatar">{item.initial}</div>
                  <div className="testimonial-meta">
                    <strong>{item.name}</strong>
                    <span>{item.role}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="insta-section">
          <div className="section-head">
            <div>
              <p className="eyebrow">@ORNIVA</p>
              <h2 className="section-title">Styled by you</h2>
            </div>
            <a href="#" className="product-link">
              Follow us
            </a>
          </div>

          <div className="insta-grid">
            {instaItems.map((item) => (
              <article key={item.title} className="insta-card">
                <img src={item.image} alt={item.title} />
                <div className="insta-overlay">
                  <h4>{item.title}</h4>
                  <a href="#">Shop the look</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="newsletter-box">
          <p className="eyebrow">The ORNIVA family</p>
          <h3>Join the list. Get 10% off.</h3>
          <p>Early access to drops, styling notes, and members-only offers.</p>

          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button type="button" className="btn-primary">
              Subscribe
            </button>
          </form>
        </section>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}

export default HomePage;