import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      const { data } = await api.post("/auth/login", formData);

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
    <div style={{ maxWidth: "420px", margin: "80px auto", padding: "24px" }}>
      <h1 style={{ marginBottom: "20px" }}>Admin Login</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
        <input
          type="email"
          name="email"
          placeholder="Admin email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ padding: "12px" }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ padding: "12px" }}
        />

        <button
          type="submit"
          style={{
            padding: "12px",
            cursor: "pointer",
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLoginPage;