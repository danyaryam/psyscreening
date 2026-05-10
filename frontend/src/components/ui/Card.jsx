import { cn } from "@/utils/cn";

export function Card({ className, children }) {
  return (
    <div className={cn("panel p-6 sm:p-7", className)}>
      {children}
    </div>
  );
}
