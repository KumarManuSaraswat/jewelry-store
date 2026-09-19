import { Link, NavLink, useNavigate } from "react-router-dom";
import { getUserInfo, logoutUser } from "../../utils/auth";
import Icon from "../Icon";
export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const user = getUserInfo();
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="brand-logo" to="/admin">
          orniva
        </Link>
        <p className="eyebrow">THE OWNER WORKSPACE</p>
        <nav aria-label="Store management">
          {[
            ["", "Overview", "grid"],
            ["products", "Products & inventory", "spark"],
            ["orders", "Orders", "bag"],
            ["customers", "Customers", "user"],
            ["users", "Team & access", "box"],
          ].map(([path, label, icon]) => (
            <NavLink
              key={path}
              end={!path}
              to={"/admin" + (path ? "/" + path : "")}
            >
              <Icon name={icon} size={19} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <Link to="/">
            Visit your store <Icon name="arrow" size={16} />
          </Link>
          <button
            onClick={() => {
              logoutUser();
              navigate("/login");
            }}
          >
            <Icon name="logout" size={16} /> Sign out
          </button>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <span>ORNIVA / STORE MANAGEMENT</span>
          <span>{user?.name || "Store owner"}</span>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
