import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useAuth } from "@/hooks/useAuth";

export function ProtectedRoute() {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
