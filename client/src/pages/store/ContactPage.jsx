import { Link } from "react-router-dom";

const WHATSAPP_NUMBER = "917231932107";

function ContactPage() {
  const openWhatsApp = () => {
    const message = `Hello ORNIVA, I need help with an order or product inquiry.`;
    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="page-shell">
      <div className="container">
        <section className="section">
          <div className="section-head">
            <div>
              <p className="eyebrow">Contact ORNIVA</p>
              <h1 className="section-title">We’d love to hear from you</h1>
              <p className="section-subtitle">
                For order support, gifting help, product questions, or custom
                requests, use the details below and our team will get back to you.
              </p>
            </div>
          </div>

          <div className="contact-grid">
            <div className="contact-card">
              <h3>Email</h3>
              <p>
                <a href="mailto:Orniva.online@gmail.com">Orniva.online@gmail.com</a>
              </p>
            </div>

            <div className="contact-card">
              <h3>Phone / WhatsApp</h3>
              <p>
                <a href="tel:+917231932107">+91 72319 32107</a>
              </p>
              <button type="button" className="btn-secondary" onClick={openWhatsApp}>
                Chat on WhatsApp
              </button>
            </div>

            <div className="contact-card">
              <h3>Instagram</h3>
              <p>
                <a
                  href="https://instagram.com/_orniva"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  @_orniva
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="admin-section-card" style={{ marginTop: 0 }}>
            <h2 style={{ marginTop: 0 }}>Send a message</h2>
            <p style={{ color: "var(--muted)", marginBottom: "18px" }}>
              For now this form is presentational. You can later connect it to
              your backend or EmailJS.
            </p>

            <form className="contact-form">
              <div className="contact-form-grid">
                <input type="text" placeholder="Your name" />
                <input type="email" placeholder="Your email" />
              </div>

              <input type="text" placeholder="Subject" />

              <textarea rows="6" placeholder="Your message"></textarea>

              <button type="button" className="btn-primary">
                Send Message
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ContactPage;