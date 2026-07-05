import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <div className="page-shell">
      <div className="container">
        <section className="about-hero">
          <div className="about-copy">
            <p className="eyebrow">About ORNIVA</p>
            <h1 className="section-title">Jewelry designed for modern everyday elegance.</h1>
            <p className="section-subtitle">
              ORNIVA was imagined as a refined jewelry label for women who want
              pieces that feel elevated, wearable, and timeless without being
              overly heavy or occasion-bound.
            </p>
            <p className="section-subtitle">
              Our collections focus on graceful shapes, soft gold finishes, and
              effortless styling so every piece can move from everyday moments
              to meaningful celebrations.
            </p>

            <div className="hero-actions">
              <Link to="/shop" className="btn-primary">
                Shop Collection
              </Link>
              <Link to="/contact" className="btn-secondary">
                Contact Us
              </Link>
            </div>
          </div>

          <div className="about-hero-card">
            <img
              src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=1200&q=80"
              alt="ORNIVA jewelry editorial"
            />
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <p className="eyebrow">Our philosophy</p>
              <h2 className="section-title">Luxury in a lighter, more wearable form</h2>
            </div>
          </div>

          <div className="about-grid">
            <article className="about-card">
              <h3>Designed to be worn often</h3>
              <p>
                We believe jewelry should not wait in a box for special dates.
                ORNIVA pieces are meant to be styled easily, layered naturally,
                and worn with confidence every day.
              </p>
            </article>

            <article className="about-card">
              <h3>Elegant without excess</h3>
              <p>
                The brand aesthetic is soft, polished, and quietly expressive.
                Every piece is selected to feel feminine, giftable, and modern
                while staying timeless beyond seasonal trends.
              </p>
            </article>

            <article className="about-card">
              <h3>Made for gifting and self-expression</h3>
              <p>
                Whether you are buying for yourself or someone you love, the
                ORNIVA experience is built around thoughtful design, premium
                presentation, and a memorable unboxing feel.
              </p>
            </article>
          </div>
        </section>

        <section className="promise-section">
          <div className="promise-card">
            <img
              src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80"
              alt="Jewelry collection detail"
              className="promise-image"
            />

            <div className="promise-copy">
              <p className="eyebrow">The ORNIVA Promise</p>
              <h2>Thoughtful quality, graceful detail, and a polished finish.</h2>
              <p>
                We aim to create a jewelry shopping experience that feels
                premium, welcoming, and easy to trust from browsing to gifting.
              </p>

              <div className="promise-points">
                <span className="promise-pill">18k Gold Plated</span>
                <span className="promise-pill">Carefully Curated</span>
                <span className="promise-pill">Gift-Ready Feel</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head">
            <div>
              <p className="eyebrow">Why customers choose us</p>
              <h2 className="section-title">Built around trust and ease</h2>
            </div>
          </div>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">01</div>
              <h3>Premium look</h3>
              <p>
                Elevated product styling, refined finishes, and a luxury-inspired
                brand experience.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon">02</div>
              <h3>Gift-worthy pieces</h3>
              <p>
                Elegant, versatile jewelry suitable for everyday wear and
                meaningful gifting moments.
              </p>
            </div>

            <div className="why-card">
              <div className="why-icon">03</div>
              <h3>Customer-first support</h3>
              <p>
                A smoother buying experience with accessible support, clear
                communication, and simple order follow-up.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;