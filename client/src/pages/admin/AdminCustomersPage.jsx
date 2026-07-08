import { useEffect, useState } from "react";
import api from "../../api/axios";
import { getAuthConfig } from "../../utils/auth";

function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data } = await api.get("/api/users", getAuthConfig());

        const onlyCustomers = data.filter((user) => user.role !== "admin");
        setCustomers(onlyCustomers);
      } catch (error) {
        console.error(error);
        alert("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div>
      <h1>Customers</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        View registered customer accounts for the store.
      </p>

      <div className="admin-section-card">
        {loading ? (
          <p>Loading customers...</p>
        ) : customers.length ? (
          customers.map((customer) => (
            <div key={customer._id} className="user-role-row">
              <div>
                <strong>{customer.name}</strong>
                <p style={{ margin: "6px 0 0", color: "#666" }}>
                  {customer.email}
                </p>
              </div>

              <span className="status-badge">{customer.role}</span>
            </div>
          ))
        ) : (
          <p>No customers found.</p>
        )}
      </div>
    </div>
  );
}

export default AdminCustomersPage;