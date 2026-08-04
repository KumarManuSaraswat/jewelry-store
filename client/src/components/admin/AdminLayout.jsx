import { Link, NavLink, useNavigate } from "react-router-dom";
import { getUserInfo, logoutUser } from "../../utils/auth";

function AdminLayout({ children }) {
  const navigate = useNavigate();
  const user = getUserInfo();

  const handleLogout = () => {
    logoutUser();
    navigate("/admin/login");
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "240px 1fr" }}>
      <aside
        style={{
          borderRight: "1px solid #e5e5e5",
          padding: "24px",
          background: "#faf8f5",
        }}
      >
        <Link
          to="/admin"
          style={{
            textDecoration: "none",
            color: "#111",
            fontSize: "22px",
            fontWeight: "700",
            display: "inline-block",
            marginBottom: "24px",
          }}
        >
          ORNIVA Admin
        </Link>

        <p style={{ color: "#666", marginBottom: "20px" }}>
          {user?.name || "Admin"}
        </p>

        <nav style={{ display: "grid", gap: "12px" }}>
          <NavLink to="/admin">Dashboard</NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/orders">Orders</NavLink>
          <NavLink to="/admin/users">Users</NavLink>
          <NavLink to="/admin/customers">Customers</NavLink>
        </nav>

        <button
          onClick={handleLogout}
          style={{
            marginTop: "24px",
            padding: "10px 14px",
            cursor: "pointer",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fff",
          }}
        >
          Logout
        </button>
      </aside>

      <main style={{ padding: "32px" }}>{children}</main>
    </div>
  );
}

export default AdminLayout;