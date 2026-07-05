import { useEffect, useState } from "react";
import api from "../../api/axios";
import { getAuthConfig } from "../../utils/auth";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users", getAuthConfig());
      setUsers(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (userId, role) => {
    try {
      await api.put(`/users/${userId}/role`, { role }, getAuthConfig());
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update role");
    }
  };

  return (
    <div>
      <h1>User Roles</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Manage admin and customer access for the dashboard.
      </p>

      <div className="admin-section-card">
        {loading ? (
          <p>Loading users...</p>
        ) : users.length ? (
          users.map((user) => (
            <div key={user._id} className="user-role-row">
              <div>
                <strong>{user.name}</strong>
                <p style={{ margin: "6px 0 0", color: "#666" }}>
                  {user.email}
                </p>
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