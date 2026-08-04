import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { getUserInfo, logoutUser, isAdminLoggedIn } from "../../utils/auth";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totals } = useCart();
  const navigate = useNavigate();

  const user = getUserInfo();
  const isLoggedIn = !!user?.token;
  const adminLoggedIn = isAdminLoggedIn();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logoutUser();
    closeMenu();
    navigate("/");
  };

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
            {isLoggedIn ? (
              <>
                <Link to="/my-orders" className="nav-action" onClick={closeMenu}>
                  My Orders
                </Link>
                <button type="button" className="nav-action" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-action" onClick={closeMenu}>
                  Login
                </Link>
                <Link to="/register" className="nav-action" onClick={closeMenu}>
                  Sign Up
                </Link>
              </>
            )}

            <Link
              to="/cart"
              className="nav-action nav-action-dark"
              onClick={closeMenu}
            >
              Bag ({totals.totalItems})
            </Link>

            {adminLoggedIn ? (
              <Link to="/admin" className="nav-action" onClick={closeMenu}>
                Admin
              </Link>
            ) : null}
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

            {isLoggedIn ? (
              <>
                <NavLink to="/my-orders" className="mobile-link" onClick={closeMenu}>
                  My Orders
                </NavLink>
                <button
                  type="button"
                  className="mobile-link"
                  onClick={handleLogout}
                  style={{ textAlign: "left" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="mobile-link" onClick={closeMenu}>
                  Login
                </NavLink>
                <NavLink to="/register" className="mobile-link" onClick={closeMenu}>
                  Sign Up
                </NavLink>
              </>
            )}

            <NavLink to="/cart" className="mobile-link" onClick={closeMenu}>
              Bag ({totals.totalItems})
            </NavLink>

            {adminLoggedIn ? (
              <NavLink to="/admin" className="mobile-link" onClick={closeMenu}>
                Admin
              </NavLink>
            ) : null}
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;