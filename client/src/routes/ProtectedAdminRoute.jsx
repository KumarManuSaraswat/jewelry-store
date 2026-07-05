import { Navigate, Outlet } from "react-router-dom";
import { isAdminLoggedIn } from "../utils/auth";

function ProtectedAdminRoute() {
  return isAdminLoggedIn() ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

export default ProtectedAdminRoute;