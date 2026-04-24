import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "../ui/Button";

const navItems = [
  { label: "Fitur", href: "#fitur" },
  { label: "Cara Kerja", href: "#cara-kerja" },
  { label: "Keunggulan", href: "#keunggulan" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-background/80 backdrop-blur-xl dark:border-white/10">
      <div className="container-shell flex h-20 items-center justify-between gap-4">
        <Link to="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          {user ? (
            <NavLink to={user.role === "admin" ? "/admin/dashboard" : "/app/dashboard"}>
              <Button variant="secondary">Buka Dashboard</Button>
            </NavLink>
          ) : (
            <>
              <NavLink to="/login">
                <Button variant="secondary">Login</Button>
              </NavLink>
              <NavLink to="/register">
                <Button>Mulai Screening</Button>
              </NavLink>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/5"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/40 bg-background/95 py-4 backdrop-blur-lg dark:border-white/10 lg:hidden">
          <div className="container-shell flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-3">
              {user ? (
                <NavLink to={user.role === "admin" ? "/admin/dashboard" : "/app/dashboard"}>
                  <Button className="w-full">Buka Dashboard</Button>
                </NavLink>
              ) : (
                <>
                  <NavLink to="/login">
                    <Button variant="secondary" className="w-full">
                      Login
                    </Button>
                  </NavLink>
                  <NavLink to="/register">
                    <Button className="w-full">Mulai Screening</Button>
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
