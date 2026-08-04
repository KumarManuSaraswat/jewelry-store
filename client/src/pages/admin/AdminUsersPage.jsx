import { useEffect, useState } from "react";
import api from "../../api/axios";
import { getAuthConfig } from "../../utils/auth";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminForm, setAdminForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/api/users", getAuthConfig());
      setUsers(data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (userId, role) => {
    try {
      await api.put(`/api/users/${userId}/role`, { role }, getAuthConfig());
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update role");
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/admin/create", adminForm, getAuthConfig());
      alert("Admin created successfully");
      setAdminForm({ name: "", email: "", password: "" });
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create admin");
    }
  };

  return (
    <div>
      <h1>User Roles</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Manage admin and customer access for the dashboard.
      </p>

      <div className="admin-section-card">
        <h2 style={{ marginTop: 0 }}>Create Admin</h2>
        <form onSubmit={handleCreateAdmin} style={{ display: "grid", gap: "12px", marginBottom: "24px" }}>
          <input
            name="name"
            placeholder="Full Name"
            value={adminForm.name}
            onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Admin Email"
            value={adminForm.email}
            onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Temporary Password"
            value={adminForm.password}
            onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
            required
          />
          <button className="btn-primary" type="submit">
            Create Admin
          </button>
        </form>

        <h2 style={{ marginTop: 0 }}>All Users</h2>

        {loading ? (
          <p>Loading users...</p>
        ) : users.length ? (
          users.map((user) => (
            <div key={user._id} className="user-role-row">
              <div>
                <strong>{user.name}</strong>
                <p style={{ margin: "6px 0 0", color: "#666" }}>{user.email}</p>
                <p style={{ margin: "6px 0 0", color: "#666" }}>
                  Current role: {user.role}
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  className="small-action-btn"
                  type="button"
                  onClick={() => updateRole(user._id, "customer")}
                  disabled={user.role === "customer"}
                >
                  Make Customer
                </button>

                <button
                  className="small-action-btn dark"
                  type="button"
                  onClick={() => updateRole(user._id, "admin")}
                  disabled={user.role === "admin"}
                >
                  Make Admin
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
}

export default AdminUsersPage;