import { cn } from "@/utils/cn";

const toneClasses = {
  neutral: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200",
  brand: "bg-brand-soft text-brand-deep dark:bg-brand-soft dark:text-brand-deep",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  danger: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

export function Badge({ className, tone = "neutral", children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
