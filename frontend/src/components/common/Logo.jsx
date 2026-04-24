import { BrainCircuit } from "lucide-react";
import { cn } from "@/utils/cn";

export function Logo({ className, compact = false }) {
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-accent text-white shadow-glow">
        <BrainCircuit className="size-5" />
      </div>
      {!compact ? (
        <div>
          <p className="text-base font-semibold tracking-tight text-slate-950 dark:text-white">
            PsyScreening
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Mental Health Screening Platform
          </p>
        </div>
      ) : null}
    </div>
  );
}
