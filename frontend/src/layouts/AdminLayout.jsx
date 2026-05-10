import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/common/AppSidebar";
import { ADMIN_NAV_ITEMS } from "@/utils/constants";

export function AdminLayout() {
  return (
    <div className="min-h-screen lg:grid lg:h-screen lg:grid-cols-[300px_1fr] lg:overflow-hidden">
      <AppSidebar
        title="Area Admin"
        subtitle="Kelola data pengguna, pertanyaan, dan hasil screening."
        navItems={ADMIN_NAV_ITEMS}
      />
      <main className="min-h-screen px-4 pb-6 pt-4 sm:px-6 lg:h-screen lg:min-h-0 lg:overflow-y-auto lg:px-10 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}
