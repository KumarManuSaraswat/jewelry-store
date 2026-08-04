import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { isAdminLoggedIn } from "../../utils/auth";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isAdminLoggedIn()) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post("/api/auth/login", formData);

      if (data.role !== "admin") {
        alert("Access denied. Admin only.");
        return;
      }

      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/admin");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="page-shell">
      <div className="container" style={{ maxWidth: "420px" }}>
        <h1>Admin Login</h1>
        <p style={{ color: "#666", marginBottom: "20px" }}>
          Sign in with an admin account to manage products, orders, and roles.
        </p>

        <form className="admin-section-card" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Admin email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button className="btn-primary" type="submit">
            Login
          </button>

          <p style={{ marginTop: "12px", color: "#666" }}>
            Need customer login? <Link to="/login">Go to customer login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default AdminLoginPage;