import { Link } from "react-router-dom";
import Icon from "../Icon";
export default function Footer() {
  return (
    <footer className="footer-large">
      <div className="container">
        <div className="footer-top">
          <div>
            <p className="eyebrow">A LITTLE CLOSER TO ORNIVA</p>
            <h2>
              Good things deserve
              <br />
              <em>to be shared.</em>
            </h2>
          </div>
          <div>
            <p>
              New pieces, everyday inspiration, and a little sparkle.
              <br />
              Find us on Instagram.
            </p>
            <a
              href="https://instagram.com/_orniva"
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Follow @_orniva <Icon name="arrow" size={18} />
            </a>
          </div>
        </div>
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="brand-logo" to="/">
              orniva
            </Link>
            <p>
              Timeless jewelry. Thoughtful details.
              <br />
              Made to be part of your every day.
            </p>
            <a href="mailto:Orniva.online@gmail.com">Orniva.online@gmail.com</a>
          </div>
          <div>
            <h3>Explore</h3>
            <Link to="/shop">All jewelry</Link>
            <Link to="/shop?collection=new">New arrivals</Link>
            <Link to="/shop?collection=bestsellers">Best sellers</Link>
            <Link to="/wishlist">Your wishlist</Link>
          </div>
          <div>
            <h3>Here to help</h3>
            <Link to="/contact">Contact us</Link>
            <Link to="/care">Jewelry care</Link>
            <Link to="/shipping-returns">Shipping & returns</Link>
            <Link to="/my-orders">Track your order</Link>
          </div>
          <div>
            <h3>About Orniva</h3>
            <Link to="/">Meet Orniva</Link>
            <Link to="/about">Our story</Link>
            <a
              href="https://instagram.com/_orniva"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a
              href="https://wa.me/917231932107"
              target="_blank"
              rel="noreferrer"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Orniva. All rights reserved.
          </span>
          <span>Made with a little love. Worn with a little confidence.</span>
          <span>Cash on delivery · WhatsApp orders</span>
        </div>
      </div>
    </footer>
  );
}
