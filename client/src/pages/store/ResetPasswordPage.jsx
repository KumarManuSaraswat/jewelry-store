import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/axios";
export default function ResetPasswordPage() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Your passwords don’t match.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await api.post("/api/auth/reset-password/" + token, { password });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to reset your password.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="container page-shell content-narrow">
      <p className="eyebrow">YOUR ORNIVA ACCOUNT</p>
      <h1>A new beginning.</h1>
      {done ? (
        <div className="empty-state">
          <h3>Your password has been updated.</h3>
          <Link className="btn-primary" to="/login">
            Sign in
          </Link>
        </div>
      ) : (
        <form className="form-stack" onSubmit={submit}>
          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}
          <label>
            New password
            <input
              type="password"
              autoComplete="new-password"
              minLength="8"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label>
            Confirm new password
            <input
              type="password"
              autoComplete="new-password"
              minLength="8"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </label>
          <button className="btn-primary" disabled={busy}>
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>
      )}
    </div>
  );
}
