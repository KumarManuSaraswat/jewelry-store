import { Link } from "react-router-dom";
export default function AboutPage() {
  return (
    <div className="page-shell">
      <div className="container">
        <div className="info-intro">
          <p className="eyebrow">MEET ORNIVA</p>
          <h1>
            Everyday jewelry.
            <br />
            <em>Extraordinary you.</em>
          </h1>
          <p>
            ORNIVA was created for those who love jewelry that feels elegant,
            modern, and easy to wear every day.
          </p>
        </div>
        <section className="story-section" style={{ paddingTop: 10 }}>
          <div className="story-image">
            <img
              src="/assets/mobile-hero.jpg"
              alt="Everyday gold jewelry by Orniva"
            />
          </div>
          <div className="story-copy">
            <p className="eyebrow">THE ORNIVA PROMISE</p>
            <h2>
              Thoughtful quality.
              <br />
              <em>Graceful detail.</em>
            </h2>
            <p>
              We believe the pieces you wear should feel like a part of you. Our
              collection brings together refined finishes, versatile designs,
              and an appreciation for the little things.
            </p>
            <p>
              From everyday mornings to meaningful celebrations, our jewelry is
              made to be layered, loved, and given with care.
            </p>
            <Link className="btn-primary" to="/shop">
              Find a piece of you
            </Link>
          </div>
        </section>
        <div className="why-grid">
          {[
            [
              "01",
              "Thoughtfully curated",
              "Elevated pieces with refined details and a polished finish.",
            ],
            [
              "02",
              "Made for giving",
              "Versatile jewelry for everyday wear and meaningful gifting moments.",
            ],
            [
              "03",
              "Here for you",
              "Personal support for sizing, gifting, and everything after your order.",
            ],
          ].map(([n, title, copy]) => (
            <article className="why-card" key={n}>
              <p className="eyebrow">{n} / OUR PROMISE</p>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
