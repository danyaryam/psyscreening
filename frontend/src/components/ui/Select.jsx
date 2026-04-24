import { forwardRef } from "react";
import { cn } from "@/utils/cn";

export const Select = forwardRef(({ className, label, error, children, ...props }, ref) => (
  <label className="block space-y-2">
    {label ? (
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </span>
    ) : null}
    <select
      ref={ref}
      className={cn(
        "w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15 dark:border-white/10 dark:bg-white/5 dark:text-white",
        error && "border-danger focus:border-danger focus:ring-danger/15",
        className,
      )}
      {...props}
    >
      {children}
    </select>
    {error ? <span className="text-sm text-danger">{error}</span> : null}
  </label>
));

Select.displayName = "Select";
