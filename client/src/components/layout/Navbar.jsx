import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../../context/CartContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totals } = useCart();

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="promo-bar">
        COMPLIMENTARY SHIPPING OVER ₹1999 · 30-DAY EASY RETURNS · CRAFTED TO LAST
      </div>

      <header className="site-header">
        <div className="container nav-shell">
          <Link to="/" className="brand-logo" onClick={closeMenu}>
            ORNIVA
          </Link>

          <div className="desktop-nav">
            <NavLink to="/" className="nav-link" onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/shop" className="nav-link" onClick={closeMenu}>
              Shop
            </NavLink>
            <NavLink to="/about" className="nav-link" onClick={closeMenu}>
              About
            </NavLink>
            <NavLink to="/contact" className="nav-link" onClick={closeMenu}>
              Contact
            </NavLink>
          </div>

          <div className="desktop-actions">
            <Link to="/my-orders" className="nav-action" onClick={closeMenu}>
              My Orders
            </Link>
            <Link
              to="/cart"
              className="nav-action nav-action-dark"
              onClick={closeMenu}
            >
              Bag ({totals.totalItems})
            </Link>
            <Link to="/admin" className="nav-action" onClick={closeMenu}>
              Admin
            </Link>
          </div>

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>

        <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
          <div className="container mobile-drawer-nav">
            <NavLink to="/" className="mobile-link" onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/shop" className="mobile-link" onClick={closeMenu}>
              Shop
            </NavLink>
            <NavLink to="/about" className="mobile-link" onClick={closeMenu}>
              About
            </NavLink>
            <NavLink to="/contact" className="mobile-link" onClick={closeMenu}>
              Contact
            </NavLink>
            <NavLink to="/my-orders" className="mobile-link" onClick={closeMenu}>
              My Orders
            </NavLink>
            <NavLink to="/cart" className="mobile-link" onClick={closeMenu}>
              Bag ({totals.totalItems})
            </NavLink>
            <NavLink to="/admin" className="mobile-link" onClick={closeMenu}>
              Admin
            </NavLink>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;