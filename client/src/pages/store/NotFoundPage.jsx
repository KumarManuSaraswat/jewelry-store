import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="page-shell">
      <div className="container">
        <div className="admin-section-card" style={{ textAlign: "center", marginTop: "40px" }}>
          <p className="eyebrow">404</p>
          <h1 className="section-title">This page is not available</h1>
          <p className="section-subtitle" style={{ margin: "0 auto 24px" }}>
            The page you are looking for may have moved, been removed, or never existed.
          </p>

          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <Link to="/" className="btn-primary">
              Back Home
            </Link>
            <Link to="/shop" className="btn-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;