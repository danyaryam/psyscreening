import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

export function AuthLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const isVerifyEmailPage = location.pathname === "/verify-email";

  if (user && !isVerifyEmailPage) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin/dashboard" : "/app/dashboard"}
        replace
        state={{ from: location }}
      />
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-hero-mesh opacity-80" />
      <div className="relative container-shell flex min-h-screen flex-col py-8">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>
          <ThemeToggle />
        </div>
        <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden lg:block">
            <div className="max-w-xl space-y-6">
              <span className="inline-flex rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-brand-deep">
                Akses PsyScreening
              </span>
              <h1 className="text-5xl font-semibold leading-tight text-slate-950 dark:text-white">
                Mulai screening awal dengan alur yang tenang dan mudah dipahami.
              </h1>
              <p className="text-base leading-8 text-slate-600 dark:text-slate-300">
                Masuk atau buat akun untuk menyimpan riwayat screening, melihat
                hasil, dan melanjutkan proses pemantauan secara lebih terarah.
              </p>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
