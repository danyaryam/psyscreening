import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";
import { cn } from "@/utils/cn";

export const PasswordInput = forwardRef(
  ({ className, label, error, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <label className="block space-y-2">
        {label ? (
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {label}
          </span>
        ) : null}
        <div className="relative">
          <input
            ref={ref}
            type={visible ? "text" : "password"}
            className={cn(
              "w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 pr-12 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-brand/15 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500",
              error && "border-danger focus:border-danger focus:ring-danger/15",
              className,
            )}
            {...props}
          />
          <button
            type="button"
            aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
            onClick={() => setVisible((current) => !current)}
            className="absolute inset-y-0 right-3 my-auto inline-flex size-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/15 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
          >
            {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {error ? <span className="text-sm text-danger">{error}</span> : null}
      </label>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
