import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer-large">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand-mark">ORNIVA</div>
            <p>
              Heirloom-quality everyday jewelry, designed to feel elevated,
              wearable, and loved for years.
            </p>

            <div className="footer-socials">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer noopener"
              >
                Instagram
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer noopener"
              >
                Pinterest
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer noopener"
              >
                Facebook
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noreferrer noopener"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <div className="footer-links">
              <Link to="/shop">All Jewelry</Link>
              <Link to="/shop?sort=newest">New Arrivals</Link>
              <Link to="/shop?filter=best-seller">Best Sellers</Link>
              <Link to="/shop">Collections</Link>
            </div>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <div className="footer-links">
              <Link to="/contact">Contact Us</Link>
              <Link to="/contact">FAQs</Link>
              <Link to="/contact">Shipping Policy</Link>
              <Link to="/contact">Returns</Link>
            </div>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <div className="footer-links">
              <Link to="/about">About ORNIVA</Link>
              <Link to="/about">Our Promise</Link>
              <Link to="/contact">Privacy Policy</Link>
              <Link to="/contact">Terms & Conditions</Link>
              <Link to="/my-orders">My Orders</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 ORNIVA. All rights reserved.</p>

          <div className="payment-row">
            <span className="payment-pill">CASH ON DELIVERY</span>
            <span className="payment-pill">WHATSAPP ORDER</span>
            <span className="payment-pill">UPI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;