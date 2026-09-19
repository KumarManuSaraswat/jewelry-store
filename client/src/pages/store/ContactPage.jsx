import { useState } from "react";
import { Link } from "react-router-dom";
import { whatsapp } from "../../utils/store";
export default function ContactPage() {
  const [form, setForm] = useState({ name: "", subject: "", message: "" });
  const draft =
    "Hello ORNIVA, my name is " +
    form.name +
    ".\n" +
    form.subject +
    "\n\n" +
    form.message;
  return (
    <div className="page-shell">
      <div className="container">
        <div className="info-intro">
          <p className="eyebrow">A CONVERSATION AWAY</p>
          <h1>
            Hello, <em>lovely.</em>
          </h1>
          <p>
            A question about a piece? A little gifting advice? Something about
            your order? We’d love to help.
          </p>
        </div>
        <div className="contact-grid">
          <article className="contact-card">
            <p className="eyebrow">01 / SAY HELLO</p>
            <h3>Write to us.</h3>
            <p>
              <a href="mailto:Orniva.online@gmail.com">
                Orniva.online@gmail.com
              </a>
            </p>
            <a href="mailto:Orniva.online@gmail.com" className="text-link">
              Open email ↗
            </a>
          </article>
          <article className="contact-card">
            <p className="eyebrow">02 / LET’S CHAT</p>
            <h3>We’re on WhatsApp.</h3>
            <p>
              <a href="tel:+917231932107">+91 72319 32107</a>
            </p>
            <a
              href={whatsapp(
                "Hello ORNIVA, I need help with an order or product inquiry.",
              )}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Start a conversation ↗
            </a>
          </article>
          <article className="contact-card">
            <p className="eyebrow">03 / THE EVERYDAY EDIT</p>
            <h3>Find a little inspiration.</h3>
            <p>Follow @_orniva for the latest pieces.</p>
            <a
              href="https://instagram.com/_orniva"
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Meet us on Instagram ↗
            </a>
          </article>
        </div>
        <section className="section content-narrow">
          <div className="section-head">
            <div>
              <p className="eyebrow">HOW CAN WE HELP?</p>
              <h2>
                Leave us a little <em>note.</em>
              </h2>
            </div>
          </div>
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              window.open(whatsapp(draft), "_blank", "noopener,noreferrer");
            }}
          >
            <div className="form-grid">
              <label>
                Your name
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label>
                What’s on your mind?
                <input
                  required
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                />
              </label>
            </div>
            <label>
              Your message
              <textarea
                rows="5"
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </label>
            <p className="summary-note">
              This opens a draft in WhatsApp. You can review and send it there.
            </p>
            <button className="btn-primary">Continue in WhatsApp ↗</button>
          </form>
          <p style={{ marginTop: 30 }}>
            <Link className="text-link" to="/shipping-returns">
              Shipping and returns questions
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
