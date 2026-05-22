import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/common/AppSidebar";
import { ADMIN_NAV_ITEMS } from "@/utils/constants";

export function AdminLayout() {
  return (
    <div className="min-h-screen overflow-x-hidden lg:h-screen lg:overflow-hidden">
      <AppSidebar
        title="Area Admin"
        subtitle="Kelola data pengguna, pertanyaan, dan hasil screening."
        navItems={ADMIN_NAV_ITEMS}
      />
      <main className="min-h-screen px-4 pb-6 pt-4 sm:px-6 lg:ml-[280px] lg:h-screen lg:min-h-0 lg:overflow-y-auto lg:px-8 lg:py-8 xl:ml-[300px] xl:px-10">
        <Outlet />
      </main>
    </div>
  );
}
