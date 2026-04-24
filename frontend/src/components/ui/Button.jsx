import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const variants = {
  primary:
    "bg-brand text-white shadow-glow hover:bg-brand/90 focus-visible:ring-brand/40",
  secondary:
    "bg-white/80 text-slate-900 ring-1 ring-slate-200 hover:bg-white dark:bg-white/10 dark:text-white dark:ring-white/10 dark:hover:bg-white/15",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10",
  danger:
    "bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger/40",
};

const sizes = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef(
  ({ className, variant = "primary", size = "md", loading, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    />
  ),
);

Button.displayName = "Button";
