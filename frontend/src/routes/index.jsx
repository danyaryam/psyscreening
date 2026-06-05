import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "@/layouts/AdminLayout";
import { AppLayout } from "@/layouts/AppLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { PublicLayout } from "@/layouts/PublicLayout";
import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage";
import { AdminScreeningsPage } from "@/pages/admin/AdminScreeningsPage";
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { LandingPage } from "@/pages/public/LandingPage";
import { VerifyEmailPage } from "@/pages/VerifyEmailPage";
import { DashboardPage } from "@/pages/user/DashboardPage";
import { HistoryPage } from "@/pages/user/HistoryPage";
import { ProfilePage } from "@/pages/user/ProfilePage";
import { ScreeningChatPage } from "@/pages/user/ScreeningChatPage";
import { ScreeningResultPage } from "@/pages/user/ScreeningResultPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleRoute } from "./RoleRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleRoute allowedRoles={["user"]} />}>
          <Route element={<AppLayout />}>
            <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/app/dashboard" element={<DashboardPage />} />
            <Route path="/app/profile" element={<ProfilePage />} />
            <Route path="/app/screening/new" element={<ScreeningChatPage />} />
            <Route path="/app/history" element={<HistoryPage />} />
            <Route path="/app/results/:id" element={<ScreeningResultPage />} />
          </Route>
        </Route>

        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/screenings" element={<AdminScreeningsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
