import { Moon, SunMedium } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex size-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-700 transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <SunMedium className="size-5" />
      ) : (
        <Moon className="size-5" />
      )}
    </button>
  );
}
