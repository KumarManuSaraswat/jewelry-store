import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const { data } = await api.post("/api/auth/forgot-password", { email });
      setMessage(data.message);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to request a reset. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="page-shell container">
      <div className="auth-shell">
        <div className="auth-image" />
        <div className="auth-form">
          <p className="eyebrow">LET’S GET YOU BACK IN</p>
          <h1>A fresh start.</h1>
          <p>Enter your account email to request a password reset link.</p>
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
          {message && (
            <p className="success-message" role="status">
              {message}
            </p>
          )}
          <form className="form-stack" onSubmit={submit}>
            <label>
              Email address
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <button className="btn-primary" disabled={busy}>
              {busy ? "Requesting…" : "Send reset link"}
            </button>
            <div className="auth-links">
              <Link to="/login">Back to sign in</Link>
              <Link to="/contact">Need help?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
