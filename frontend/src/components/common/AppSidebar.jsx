import { Menu, LogOut, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "../ui/Button";

function NavItems({ items, onNavigate }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center rounded-2xl px-4 py-3 text-sm font-semibold transition",
              isActive
                ? "bg-brand text-white shadow-glow"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10",
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

export function AppSidebar({ title, subtitle, navItems }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div className="sticky top-0 z-30 border-b border-white/60 bg-background/90 px-4 py-3 backdrop-blur-xl dark:border-white/10 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white/85 shadow-sm transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle sidebar"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          <Link to="/" className="min-w-0 flex-1" onClick={() => setOpen(false)}>
            <Logo compact className="justify-center sm:justify-start" />
          </Link>

          <ThemeToggle />
        </div>
      </div>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[2px] lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 h-dvh w-[min(86vw,300px)] transform overflow-hidden border-r border-white/50 bg-background/95 px-4 py-4 backdrop-blur-xl transition duration-300 dark:border-white/10 sm:px-5 sm:py-5 lg:w-[280px] lg:translate-x-0 lg:px-5 lg:py-6 xl:w-[300px]",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex shrink-0 items-center justify-between gap-3">
            <Link to="/" className="min-w-0" onClick={() => setOpen(false)}>
              <Logo />
            </Link>
            <div className="hidden shrink-0 lg:block">
              <ThemeToggle />
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-700 transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10 lg:hidden"
              onClick={() => setOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-5 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
            <div className="rounded-[26px] bg-gradient-to-br from-brand-soft via-white to-accent-soft p-4 dark:from-brand-soft dark:via-slate-900/40 dark:to-accent-soft sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {title}
              </p>
              <h2 className="mt-3 text-lg font-semibold leading-snug text-slate-950 dark:text-white sm:text-xl">
                {subtitle}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {user?.name}
              </p>
            </div>

            <nav className="mt-5" aria-label={`${title} navigation`}>
              <NavItems items={navItems} onNavigate={() => setOpen(false)} />
            </nav>
          </div>

          <div className="mt-4 shrink-0 border-t border-slate-200/70 pt-4 dark:border-white/10">
            <Button
              variant="secondary"
              className="w-full justify-center"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              Logout
            </Button>
            <div className="mt-3 rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-xs leading-6 text-slate-500 dark:border-white/10 dark:text-slate-400 lg:hidden">
              Hasil screening adalah alat bantu awal. Prioritaskan bantuan profesional bila kondisi terasa berat atau menetap.
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
