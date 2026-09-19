import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { hasAdminAccess } from "../../utils/auth";
import useUserInfo from "../../hooks/useUserInfo";
import Icon from "../Icon";
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { totals, wishlist } = useCart();
  const navigate = useNavigate();
  const user = useUserInfo();
  const owner = hasAdminAccess(user);
  const links = [
    ["All jewelry", "/shop"],
    ["New arrivals", "/shop?collection=new"],
    ["Best sellers", "/shop?collection=bestsellers"],
    ["Earrings", "/shop?category=earrings"],
    ["Necklaces", "/shop?category=necklaces"],
    ["Rings", "/shop?category=rings"],
    ["Bracelets", "/shop?category=bracelets"],
    ["Anklets", "/shop?category=anklets"],
  ];
  function search(e) {
    e.preventDefault();
    navigate("/shop?search=" + encodeURIComponent(query.trim()));
    setSearchOpen(false);
    setMenuOpen(false);
  }
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="announcement">
        <span>Made for your everyday, and every little occasion.</span>
        <span>
          Complimentary shipping on orders over ₹1,999{" "}
          <Icon name="arrow" size={15} />
        </span>
      </div>
      <header className="site-header">
        <div className={"nav-main container" + (owner ? " owner-nav" : "")}>
          <div className="nav-left">
            <button
              className="icon-button mobile-only"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? "close" : "menu"} />
            </button>
            <button
              className="search-trigger"
              aria-label="Search jewelry"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Icon name="search" />
              <span>Find your next favorite</span>
            </button>
          </div>
          <Link to="/" className="brand-logo" aria-label="Orniva home">
            orniva<span>EVERYDAY, EXTRAORDINARY.</span>
          </Link>
          <div className="nav-actions">
            {owner && (
              <Link
                className="owner-dashboard-link"
                to="/admin"
                aria-label="Owner dashboard"
                title="Owner dashboard"
              >
                <Icon name="grid" size={18} />
                <span>Owner dashboard</span>
              </Link>
            )}
            <Link
              className="icon-button account-link"
              to={user ? "/my-orders" : "/login"}
              aria-label="My account"
            >
              <Icon name="user" />
            </Link>
            <Link
              className="icon-button"
              to="/wishlist"
              aria-label={"Wishlist, " + wishlist.length + " saved pieces"}
            >
              <Icon name="heart" />
              {wishlist.length > 0 && <small>{wishlist.length}</small>}
            </Link>
            <Link
              className="icon-button bag-link"
              to="/cart"
              aria-label={"Shopping bag, " + totals.totalItems + " items"}
            >
              <Icon name="bag" />
              <span className="bag-count">{totals.totalItems}</span>
            </Link>
          </div>
        </div>
        <nav
          className={"category-nav " + (menuOpen ? "open" : "")}
          aria-label="Main navigation"
        >
          {links.map(([label, href]) => (
            <Link to={href} key={label} onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
          <span className="nav-divider" />
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>
            Meet Orniva
          </NavLink>
          {owner && (
            <Link
              className="mobile-only owner-menu-link"
              to="/admin"
              onClick={() => setMenuOpen(false)}
            >
              <Icon name="grid" size={18} /> Owner dashboard
            </Link>
          )}
          <Link
            className="mobile-only"
            to={user ? "/my-orders" : "/login"}
            onClick={() => setMenuOpen(false)}
          >
            My account
          </Link>
          <Link
            className="mobile-only"
            to="/contact"
            onClick={() => setMenuOpen(false)}
          >
            Contact us
          </Link>
        </nav>
        {searchOpen && (
          <form className="header-search container" onSubmit={search}>
            <label className="sr-only" htmlFor="site-search">
              Search jewelry
            </label>
            <input
              id="site-search"
              autoFocus
              placeholder="Search for a piece, material, or collection…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn-primary" type="submit">
              Search <Icon name="arrow" size={18} />
            </button>
            <button
              type="button"
              className="icon-button"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
            >
              <Icon name="close" />
            </button>
          </form>
        )}
      </header>
    </>
  );
}
