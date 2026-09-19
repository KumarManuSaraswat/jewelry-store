import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  loginDestination,
  safeReturnPath,
  saveUserInfo,
} from "../../utils/auth";
export default function AuthPage({ mode = "login", admin = false }) {
  const register = mode === "register";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const redirect =
    location.state?.from ||
    new URLSearchParams(location.search).get("redirect");
  const safeRedirect = safeReturnPath(redirect);
  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post(
        "/api/auth/" + (register ? "register" : "login"),
        form,
      );
      if (admin && data.role !== "admin") {
        setError("This account doesn’t have access to the store dashboard.");
        return;
      }
      saveUserInfo(data);
      navigate(loginDestination(data, admin ? "/admin" : safeRedirect), {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "We couldn’t connect. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="page-shell">
      <div className="container">
        <div className="auth-shell">
          <div
            className="auth-image"
            role="img"
            aria-label="Orniva jewelry styled for everyday wear"
          />
          <div className="auth-form">
            <p className="eyebrow">
              {admin
                ? "ORNIVA · OWNER WORKSPACE"
                : "YOUR LITTLE CORNER OF ORNIVA"}
            </p>
            <h1>
              {register
                ? "Hello, lovely."
                : admin
                  ? "Your store, at a glance."
                  : "Welcome back."}
            </h1>
            <p>
              {register
                ? "Create an account to keep your orders close."
                : admin
                  ? "Sign in to manage your pieces, orders, and customers."
                  : "Your favorites and little moments are waiting."}
            </p>
            {error && (
              <p className="error-message" role="alert">
                {error}
              </p>
            )}
            <form className="form-stack" onSubmit={submit}>
              {register && (
                <label>
                  Your name
                  <input
                    autoComplete="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </label>
              )}
              <label>
                Email address
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  autoComplete={register ? "new-password" : "current-password"}
                  required
                  minLength={register ? 8 : undefined}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </label>
              {register && <small>Use at least 8 characters.</small>}
              <button className="btn-primary" disabled={loading}>
                {loading
                  ? "One moment…"
                  : register
                    ? "Create your account"
                    : "Sign in"}
              </button>
              <div className="auth-links">
                {!admin && (
                  <Link
                    to={
                      (register ? "/login" : "/register") +
                      (safeRedirect
                        ? "?redirect=" + encodeURIComponent(safeRedirect)
                        : "")
                    }
                  >
                    {register
                      ? "Already have an account?"
                      : "Create an account"}
                  </Link>
                )}
                {!register && (
                  <Link to="/forgot-password">Forgot password?</Link>
                )}
              </div>
            </form>
            {admin && (
              <p style={{ marginTop: 24 }}>
                <Link to="/">← Return to the store</Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
