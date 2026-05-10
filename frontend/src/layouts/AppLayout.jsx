import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/common/AppSidebar";
import { USER_NAV_ITEMS } from "@/utils/constants";

export function AppLayout() {
  return (
    <div className="min-h-screen lg:grid lg:h-screen lg:grid-cols-[300px_1fr] lg:overflow-hidden">
      <AppSidebar
        title="Area Pengguna"
        subtitle="Pantau hasil Anda dan lanjutkan screening kapan pun diperlukan."
        navItems={USER_NAV_ITEMS}
      />
      <main className="min-h-screen px-4 pb-6 pt-4 sm:px-6 lg:h-screen lg:min-h-0 lg:overflow-y-auto lg:px-10 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}
