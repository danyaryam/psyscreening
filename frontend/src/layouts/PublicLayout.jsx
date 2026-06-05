import { Outlet } from "react-router-dom";
import { Footer } from "@/components/common/Footer";
import { Navbar } from "@/components/common/Navbar";

export function PublicLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
