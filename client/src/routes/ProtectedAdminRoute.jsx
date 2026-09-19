import { Navigate, Outlet, useLocation } from "react-router-dom";
import { hasAdminAccess } from "../utils/auth";
import useUserInfo from "../hooks/useUserInfo";

function ProtectedAdminRoute() {
  const user = useUserInfo();
  const location = useLocation();
  if (hasAdminAccess(user)) return <Outlet />;
  return user ? (
    <Navigate to="/" replace />
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ from: location.pathname + location.search }}
    />
  );
}

export default ProtectedAdminRoute;
