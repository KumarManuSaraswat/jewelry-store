import { useEffect, useState } from "react";
import api from "../../api/axios";
import { getAuthConfig } from "../../utils/auth";

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get("/admin/stats", getAuthConfig()),
        api.get("/admin/users", getAuthConfig()),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to load admin dashboard");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      await api.put(
        `/admin/users/${userId}/role`,
        { role },
        getAuthConfig()
      );
      fetchDashboardData();
    } catch (error) {
      alert(error.response?.data?.message || "Role update failed");
    }
  };

  const monthlyTotal =
    stats?.salesByMonth?.reduce((acc, item) => acc + item.totalSales, 0) || 0;

  const yearlyLatest = stats?.yearlySales?.[0];

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p style={{ color: "#666", marginTop: "8px" }}>
        View revenue trends, orders, and manage store roles.
      </p>

      <div className="analytics-grid">
        <div className="analytics-card">
          <span>This Year Sales</span>
          <strong>₹{monthlyTotal.toFixed(0)}</strong>
        </div>

        <div className="analytics-card">
          <span>Latest Year Orders</span>
          <strong>{yearlyLatest?.totalOrders || 0}</strong>
        </div>

        <div className="analytics-card">
          <span>Total Customers</span>
          <strong>{stats?.totalCustomers || 0}</strong>
        </div>

        <div className="analytics-card">
          <span>Total Admins</span>
          <strong>{stats?.totalAdmins || 0}</strong>
        </div>
      </div>

      <div className="admin-section-card">
        <h2 style={{ marginTop: 0 }}>Monthly Sales</h2>
        <div style={{ display: "grid", gap: "12px" }}>
          {stats?.salesByMonth?.length ? (
            stats.salesByMonth.map((item) => (
              <div key={item._id} className="user-role-row">
                <div>
                  <strong>Month {item._id}</strong>
                  <p style={{ margin: "6px 0 0", color: "#666" }}>
                    {item.totalOrders} orders
                  </p>
                </div>
                <strong>₹{item.totalSales.toFixed(0)}</strong>
              </div>
            ))
          ) : (
            <p>No paid sales data yet.</p>
          )}
        </div>
      </div>

      <div className="admin-section-card">
        <h2 style={{ marginTop: 0 }}>Yearly Sales</h2>
        <div style={{ display: "grid", gap: "12px" }}>
          {stats?.yearlySales?.length ? (
            stats.yearlySales.map((item) => (
              <div key={item._id} className="user-role-row">
                <div>
                  <strong>{item._id}</strong>
                  <p style={{ margin: "6px 0 0", color: "#666" }}>
                    {item.totalOrders} orders
                  </p>
                </div>
                <strong>₹{item.totalSales.toFixed(0)}</strong>
              </div>
            ))
          ) : (
            <p>No yearly sales data yet.</p>
          )}
        </div>
      </div>

      <div className="admin-section-card">
        <h2 style={{ marginTop: 0 }}>User Role Management</h2>
        <div style={{ display: "grid", gap: "10px" }}>
          {users.map((user) => (
            <div key={user._id} className="user-role-row">
              <div>
                <strong>{user.name}</strong>
                <p style={{ margin: "6px 0 0", color: "#666" }}>
                  {user.email} · {user.role}
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  className="small-action-btn"
                  onClick={() => handleRoleChange(user._id, "customer")}
                  type="button"
                >
                  Make Customer
                </button>

                <button
                  className="small-action-btn dark"
                  onClick={() => handleRoleChange(user._id, "admin")}
                  type="button"
                >
                  Make Admin
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;