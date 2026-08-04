import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.post("/api/auth/forgot-password", { email });
      setMessage(data.message || "If the account exists, a reset link has been generated.");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="container" style={{ maxWidth: "520px" }}>
        <div className="section-head">
          <div>
            <p className="eyebrow">Account recovery</p>
            <h1 className="section-title">Forgot Password</h1>
          </div>
        </div>

        <form className="admin-section-card" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          {message ? <p style={{ marginTop: "12px" }}>{message}</p> : null}

          <p style={{ marginTop: "12px" }}>
            <Link to="/login">Back to login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;