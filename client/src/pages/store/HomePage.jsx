import { useState } from "react";
import { Link } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import ProductCard from "../../components/product/ProductCard";
import CollectionState from "../../components/product/CollectionState";
import Icon from "../../components/Icon";
const categoryImages = [
  [
    "Earrings",
    "earrings",
    "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=600&q=85",
  ],
  [
    "Necklaces",
    "necklaces",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=85",
  ],
  [
    "Rings",
    "rings",
    "https://images.unsplash.com/photo-1603561596112-db7f8f72b2e4?auto=format&fit=crop&w=600&q=85",
  ],
  [
    "Bracelets",
    "bracelets",
    "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=600&q=85",
  ],
  [
    "Anklets",
    "anklets",
    "https://images.unsplash.com/photo-1611107683227-e9060eccd846?auto=format&fit=crop&w=600&q=85",
  ],
];
export default function HomePage() {
  const { products, loading, error, retry } = useProducts();
  const [collection, setCollection] = useState("bestsellers");
  const curated = products.filter((p) =>
    collection === "bestsellers" ? p.isBestSeller : p.isNewArrival,
  );
  const displayed = [
    ...curated,
    ...products.filter((p) => !curated.some((c) => c._id === p._id)),
  ].slice(0, 4);
  return (
    <>
      <section className="editorial-hero">
        <div className="hero-copy">
          <p className="eyebrow">THE EVERYDAY JEWELRY EDIT</p>
          <h1>
            Small details.
            <br />
            <em>Unforgettable</em>
            <br />
            you.
          </h1>
          <p className="hero-description">
            For the everyday moments that become your story.
            <br className="desktop-only" /> Discover jewelry made to be layered,
            loved, and lived in.
          </p>
          <Link to="/shop" className="btn-primary">
            Find your everyday favorite <Icon name="arrow" size={19} />
          </Link>
          <div className="hero-footnote">
            <span className="fine-line" /> TIMELESS PIECES. A LITTLE EVERYDAY
            LUXURY.
          </div>
        </div>
        <div className="hero-visual">
          <img
            src="/assets/mobile-hero.jpg"
            alt="Layered gold necklaces, hoops and bracelets styled for everyday wear"
            fetchPriority="high"
          />
          <div className="hero-image-caption">
            <span>THE ART OF EVERYDAY</span>
            <span>01 / ORNIVA</span>
          </div>
        </div>
        <div className="hero-side-note">DESIGNED TO BE PART OF YOU</div>
      </section>
      <div className="benefits-bar">
        <div>
          <Icon name="spark" />
          <span>18k gold-plated details</span>
        </div>
        <div>
          <Icon name="truck" />
          <span>Free shipping over ₹1,999</span>
        </div>
        <div>
          <Icon name="return" />
          <span>30-day easy returns</span>
        </div>
        <div>
          <Icon name="gift" />
          <span>A little joy, beautifully wrapped</span>
        </div>
      </div>
      <section className="section container">
        <div className="section-head">
          <div>
            <p className="eyebrow">YOUR STYLE. YOUR SIGNATURE.</p>
            <h2>
              Find your kind of <em>gold.</em>
            </h2>
          </div>
          <Link to="/shop" className="text-link">
            Explore all jewelry <Icon name="arrow" size={18} />
          </Link>
        </div>
        <div className="category-grid">
          {categoryImages.map(([label, value, image], i) => (
            <Link
              key={value}
              className="category-tile"
              to={"/shop?category=" + value}
            >
              <div className="category-image">
                <img
                  src={
                    products.find((p) => p.category === value)?.images?.[0] ||
                    image
                  }
                  alt={label}
                  loading="lazy"
                />
                <span className="category-number">0{i + 1}</span>
              </div>
              <span className="category-label">
                {label}
                <Icon name="arrow" size={20} />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="section collection-section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">THE PIECES YOU COME BACK TO</p>
              <h2>
                A few <em>favorites.</em>
              </h2>
            </div>
            <Link to={"/shop?collection=" + collection} className="text-link">
              Shop the edit <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div className="collection-tabs" aria-label="Featured collections">
            {[
              ["bestsellers", "Most loved"],
              ["new", "Just arrived"],
            ].map(([value, label]) => (
              <button
                key={value}
                aria-pressed={collection === value}
                className={collection === value ? "active" : ""}
                onClick={() => setCollection(value)}
              >
                {label}
              </button>
            ))}
          </div>
          <CollectionState
            loading={loading}
            error={error}
            retry={retry}
            empty={!products.length}
          />
          {!loading && !error && (
            <div className="product-grid">
              {displayed.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="story-section container">
        <div className="story-image">
          <img
            src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=1200&q=85"
            alt="The delicate details of gold jewelry"
            loading="lazy"
          />
          <span>BEAUTY IN THE LITTLE THINGS.</span>
        </div>
        <div className="story-copy">
          <p className="eyebrow">THE ORNIVA PHILOSOPHY</p>
          <h2>
            Not just jewelry.
            <br />
            <em>A little piece of you.</em>
          </h2>
          <p>
            The necklace you reach for every morning. The earrings that make an
            ordinary day feel special. The gift that says everything.
          </p>
          <p>
            We believe beautiful jewelry belongs in your everyday. Thoughtfully
            curated, hand-finished, and made to feel like you.
          </p>
          <Link to="/about" className="text-link">
            Get to know Orniva <Icon name="arrow" size={18} />
          </Link>
        </div>
      </section>
      <section className="testimonial-section">
        <div className="container">
          <p className="eyebrow">LITTLE PIECES. LOVELY STORIES.</p>
          <h2>
            From our <em>community.</em>
          </h2>
          <div className="testimonial-grid">
            {[
              [
                "“I haven’t taken off my Luna Pearl Drops in three months. They still look flawless.”",
                "Sophia R.",
              ],
              [
                "“The packaging alone feels premium. ORNIVA genuinely looks like a brand triple the price.”",
                "Amaya K.",
              ],
              [
                "“Finally, gold-toned jewelry that feels elegant and actually lasts through daily wear.”",
                "Léa M.",
              ],
            ].map(([quote, name]) => (
              <blockquote key={name}>
                <p>{quote}</p>
                <footer>
                  {name}
                  <span>Orniva customer</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
