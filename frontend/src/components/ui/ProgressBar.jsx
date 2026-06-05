import { cn } from "@/utils/cn";

export function ProgressBar({ value, className }) {
  return (
    <div className={cn("h-2.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10", className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand to-accent transition-all duration-500"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
