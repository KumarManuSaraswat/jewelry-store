import { Link } from "react-router-dom";
import Icon from "../../components/Icon";

const edits = [
  {
    number: "01",
    title: "Your everyday signature",
    copy: "The little details you reach for, again and again.",
    label: "Explore earrings",
    href: "/shop?category=earrings",
    image:
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=85",
    alt: "Sculptural gold-toned earrings",
  },
  {
    number: "02",
    title: "A little more you",
    copy: "Wear one. Layer a few. Make the moment your own.",
    label: "Explore necklaces",
    href: "/shop?category=necklaces",
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85",
    alt: "Delicate necklaces and jewelry details",
  },
  {
    number: "03",
    title: "Something to remember",
    copy: "A thoughtful gift, for someone else or yourself.",
    label: "Explore rings",
    href: "/shop?category=rings",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85",
    alt: "A delicate ring with a stone setting",
  },
];

export default function LandingPage() {
  return (
    <div className="brand-landing">
      <section className="intro-hero" aria-labelledby="intro-title">
        <div className="intro-orbit intro-orbit-one" aria-hidden="true" />
        <div className="intro-orbit intro-orbit-two" aria-hidden="true" />
        <div className="intro-hero-inner container">
          <div className="intro-copy">
            <p
              className="eyebrow intro-enter"
              style={{ "--enter-delay": "60ms" }}
            >
              A LITTLE INTRODUCTION TO ORNIVA
            </p>
            <h1 id="intro-title">
              <span className="intro-line">
                <span>Life is in the</span>
              </span>
              <span className="intro-line">
                <em>little details.</em>
              </span>
            </h1>
            <p
              className="intro-description intro-enter"
              style={{ "--enter-delay": "260ms" }}
            >
              We’re Orniva. An online jewelry brand for everyday
              self-expression, thoughtful gifts, and moments that feel like you.
            </p>
            <div
              className="intro-actions intro-enter"
              style={{ "--enter-delay": "360ms" }}
            >
              <Link className="btn-primary intro-shop" to="/shop">
                Find your little something <Icon name="arrow" size={19} />
              </Link>
              <a className="intro-story-link" href="#meet-orniva">
                Meet Orniva <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div
              className="intro-signature intro-enter"
              style={{ "--enter-delay": "460ms" }}
            >
              <span /> EVERYDAY, EXTRAORDINARY.
            </div>
          </div>
          <div className="intro-art">
            <div className="intro-photo-frame">
              <img
                src="/assets/mobile-hero.jpg"
                alt="Gold necklaces, hoops and rings styled together for everyday wear"
                fetchPriority="high"
                width="720"
                height="960"
              />
              <span className="intro-photo-note">THE ART OF BEING YOU</span>
            </div>
            <div className="intro-spark" aria-hidden="true">
              <Icon name="spark" size={57} />
            </div>
            <div className="intro-keepsake">
              <span className="intro-keepsake-mark" aria-hidden="true">
                o.
              </span>
              <div>
                <span>A NOTE FROM ORNIVA</span>
                <p>
                  Small things.
                  <br />
                  <em>Beautiful meaning.</em>
                </p>
              </div>
            </div>
            <span className="intro-edition">THE EVERYDAY COLLECTION / 01</span>
          </div>
        </div>
        <div className="intro-bottom container">
          <span>JEWELRY TO LAYER, LOVE & LIVE IN</span>
          <a href="#meet-orniva">
            A little more about us <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section
        id="meet-orniva"
        className="brand-introduction container"
        aria-labelledby="brand-intro-title"
      >
        <div className="brand-intro-label" data-reveal>
          <Icon name="spark" size={26} />
          <p className="eyebrow">HELLO, WE’RE ORNIVA.</p>
          <span>Jewelry. With a little feeling.</span>
        </div>
        <div className="brand-intro-text" data-reveal>
          <h2 id="brand-intro-title">
            For the ordinary days.
            <br />
            For the <em>unforgettable you.</em>
          </h2>
          <p>
            Some pieces become part of your story. A favorite pair of earrings.
            A necklace you never leave home without. A ring that reminds you of
            someone.
          </p>
          <p>
            We bring together elegant, modern jewelry that’s easy to make your
            own. Explore earrings, necklaces, rings, bracelets, and anklets,
            thoughtfully curated for everyday wear and meaningful gifting.
          </p>
          <Link to="/about" className="text-link">
            The story behind Orniva <Icon name="arrow" size={18} />
          </Link>
        </div>
      </section>

      <section className="brand-edits" aria-labelledby="edits-title">
        <div className="container">
          <div className="section-head" data-reveal>
            <div>
              <p className="eyebrow">MORE THAN AN OCCASION</p>
              <h2 id="edits-title">
                A little something for <em>every you.</em>
              </h2>
            </div>
            <Link className="text-link" to="/collections">
              Discover the jewelry edit <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div className="brand-edit-grid">
            {edits.map((edit) => (
              <Link
                className="brand-edit-card"
                to={edit.href}
                key={edit.number}
                data-reveal
              >
                <div className="brand-edit-image">
                  <img
                    src={edit.image}
                    alt={edit.alt}
                    loading="lazy"
                    width="600"
                    height="750"
                  />
                  <span>{edit.number} / THE ORNIVA EDIT</span>
                  <div className="brand-edit-arrow" aria-hidden="true">
                    <Icon name="arrow" size={24} />
                  </div>
                </div>
                <h3>{edit.title}</h3>
                <p>{edit.copy}</p>
                <span className="brand-edit-link">
                  {edit.label} <Icon name="arrow" size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        className="brand-values container"
        aria-label="The Orniva experience"
      >
        {[
          [
            "spark",
            "Thoughtfully chosen",
            "Modern designs, graceful details, and pieces that fit into your every day.",
          ],
          [
            "gift",
            "Made for meaningful moments",
            "A little celebration. A heartfelt thank-you. Or something lovely, just for you.",
          ],
          [
            "heart",
            "A personal touch",
            "Need help choosing? Talk to us about styling, sizing, or finding a thoughtful gift.",
          ],
        ].map(([icon, title, copy], index) => (
          <article className="brand-value" key={title} data-reveal>
            <div>
              <Icon name={icon} size={25} />
              <span>0{index + 1}</span>
            </div>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      <section className="brand-invitation" aria-labelledby="invitation-title">
        <span className="invitation-watermark" aria-hidden="true">
          orniva
        </span>
        <div className="container" data-reveal>
          <Icon name="spark" size={28} />
          <p className="eyebrow">YOUR EVERYDAY STARTS HERE</p>
          <h2 id="invitation-title">
            Come for the jewelry.
            <br />
            <em>Find a little piece of you.</em>
          </h2>
          <div className="invitation-actions">
            <Link className="btn-primary" to="/shop">
              Explore all jewelry <Icon name="arrow" size={19} />
            </Link>
            <Link className="text-link" to="/contact">
              Let’s find your favorite <Icon name="arrow" size={18} />
            </Link>
          </div>
          <div className="invitation-assurances">
            <span>
              <Icon name="truck" size={18} /> Free shipping over ₹1,999
            </span>
            <span>
              <Icon name="return" size={18} /> 30-day easy returns
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
