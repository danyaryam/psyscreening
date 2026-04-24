import { Menu, LogOut, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
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

  return (
    <>
      <div className="sticky top-0 z-30 border-b border-white/60 bg-background/85 px-4 py-4 backdrop-blur-xl dark:border-white/10 lg:hidden">
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
          "fixed inset-y-0 left-0 z-50 w-[300px] transform overflow-hidden border-r border-white/50 bg-background/95 px-5 py-6 backdrop-blur-xl transition duration-300 dark:border-white/10 lg:static lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between">
            <Link to="/" onClick={() => setOpen(false)}>
              <Logo />
            </Link>
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <div className="rounded-[28px] bg-gradient-to-br from-brand-soft via-white to-accent-soft p-5 dark:from-brand-soft dark:via-slate-900/40 dark:to-accent-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {title}
              </p>
              <h2 className="mt-3 text-xl font-semibold text-slate-950 dark:text-white">
                {subtitle}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {user?.name}
              </p>
            </div>

            <NavItems items={navItems} onNavigate={() => setOpen(false)} />
          </div>

          <div className="mt-6 border-t border-slate-200/70 pt-4 dark:border-white/10">
            <Button
              variant="secondary"
              className="w-full justify-center"
              onClick={logout}
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
