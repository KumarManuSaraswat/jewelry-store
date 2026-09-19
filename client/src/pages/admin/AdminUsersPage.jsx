import { useEffect, useState } from "react";
import api from "../../api/axios";
import { getUserInfo } from "../../utils/auth";
export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const current = getUserInfo();
  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/api/users", { signal: controller.signal })
      .then(({ data }) => setUsers(data))
      .catch((err) => {
        if (err.code !== "ERR_CANCELED")
          setError(err.response?.data?.message || "Unable to load your team.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);
  async function role(user, value) {
    if (
      !window.confirm(
        value === "admin"
          ? "Give " +
              user.name +
              " access to products, orders, customer information, and team management?"
          : "Remove " + user.name + "’s owner access?",
      )
    )
      return;
    setError("");
    try {
      const { data } = await api.put("/api/users/" + user._id + "/role", {
        role: value,
      });
      setUsers((list) =>
        list.map((u) => (u._id === user._id ? { ...u, role: data.role } : u)),
      );
      setNotice("Access updated.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not update access.");
    }
  }
  async function create(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/api/auth/admin/create", form);
      setUsers((list) => [data, ...list]);
      setForm({ name: "", email: "", password: "" });
      setNotice("Team account created.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create team account.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <p className="eyebrow">THE PEOPLE BEHIND ORNIVA</p>
      <h1>Team & access.</h1>
      <p className="section-subtitle">
        Owner accounts can manage products, orders, customers, and other team
        members.
      </p>
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="success-message" role="status">
          {notice}
        </p>
      )}
      <section className="admin-section-card">
        <h2>Add a team member</h2>
        <form onSubmit={create} className="form-grid">
          <label>
            Name
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label>
            Initial password
            <input
              type="password"
              minLength="8"
              required
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>
          <button className="btn-primary" disabled={busy}>
            {busy ? "Creating…" : "Create owner account"}
          </button>
        </form>
      </section>
      <section className="admin-section-card">
        <h2>Store accounts</h2>
        {loading ? (
          <p role="status">Loading accounts…</p>
        ) : (
          users.map((user) => (
            <div className="user-role-row" key={user._id}>
              <div>
                <strong>
                  {user.name}
                  {user._id === current?._id ? " (you)" : ""}
                </strong>
                <p className="summary-note">
                  {user.email} · {user.role}
                </p>
              </div>
              {user._id !== current?._id && (
                <button
                  className="small-action-btn"
                  onClick={() =>
                    role(user, user.role === "admin" ? "customer" : "admin")
                  }
                >
                  {user.role === "admin"
                    ? "Remove owner access"
                    : "Grant owner access"}
                </button>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
}
