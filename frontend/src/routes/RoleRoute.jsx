import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function RoleRoute({ allowedRoles }) {
  const { user } = useAuth();

  if (!allowedRoles.includes(user?.role)) {
    return (
      <Navigate
        to={user?.role === "admin" ? "/admin/dashboard" : "/app/dashboard"}
        replace
      />
    );
  }

  return <Outlet />;
}
