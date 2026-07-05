import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <div className="page-shell">
      <div className="container">
        <div
          className="admin-section-card"
          style={{
            maxWidth: "520px",
            margin: "50px auto 0",
            textAlign: "center",
          }}
        >
          <p className="eyebrow">Account</p>
          <h1 className="section-title">Login coming soon</h1>
          <p className="section-subtitle" style={{ margin: "0 auto 24px" }}>
            This version of the store focuses on browsing, cart, checkout, and admin
            management. Customer account login can be added in the next update.
          </p>

          <Link to="/shop" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;