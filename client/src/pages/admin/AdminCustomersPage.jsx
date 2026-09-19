import { useEffect, useState } from "react";
import api from "../../api/axios";
import { money } from "../../utils/store";
import { exportCsv } from "../../utils/export";
export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      api.get("/api/users", { signal: controller.signal }),
      api.get("/api/orders", { signal: controller.signal }),
    ])
      .then(([users, orders]) =>
        setCustomers(
          users.data
            .filter((u) => u.role === "customer")
            .map((user) => {
              const own = orders.data.filter(
                (o) => (o.user?._id || o.user) === user._id,
              );
              return {
                ...user,
                orders: own.length,
                spent: own
                  .filter((o) => o.paymentStatus === "paid")
                  .reduce((sum, o) => sum + o.totalPrice, 0),
              };
            }),
        ),
      )
      .catch((err) => {
        if (err.code !== "ERR_CANCELED")
          setError(err.response?.data?.message || "Unable to load customers.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);
  const visible = customers.filter((u) =>
    (u.name + " " + u.email).toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">THE ORNIVA COMMUNITY</p>
          <h1>Your customers.</h1>
          <p className="section-subtitle">
            The people who make your story possible.
          </p>
        </div>
        <button
          className="btn-secondary"
          disabled={!visible.length}
          onClick={() =>
            exportCsv(
              "orniva-customers.csv",
              ["Name", "Email", "Orders", "Paid spend (INR)"],
              visible.map((u) => [u.name, u.email, u.orders, u.spent]),
            )
          }
        >
          Export customers
        </button>
      </div>
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      <div className="admin-toolbar">
        <input
          aria-label="Search customers"
          placeholder="Find by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="summary-note">{visible.length} customers</span>
      </div>
      <div className="admin-section-card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              <th>Joined</th>
              <th>Orders</th>
              <th>Paid spend</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  {u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString("en-IN")
                    : "—"}
                </td>
                <td>{u.orders}</td>
                <td>{money(u.spent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading ? (
          <p role="status">Loading customers…</p>
        ) : (
          !visible.length && (
            <p className="admin-empty">No customers match your search.</p>
          )
        )}
      </div>
    </div>
  );
}
