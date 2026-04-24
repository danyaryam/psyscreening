import { Card } from "../ui/Card";

export function StatCard({ icon: Icon, label, value, hint, tone = "brand" }) {
  const toneMap = {
    brand: "from-brand-soft to-white dark:from-brand-soft dark:to-white/5",
    accent: "from-accent-soft to-white dark:from-accent-soft dark:to-white/5",
    success: "from-emerald-100 to-white dark:from-emerald-500/10 dark:to-white/5",
    warning: "from-amber-100 to-white dark:from-amber-500/10 dark:to-white/5",
  };

  return (
    <Card className={`bg-gradient-to-br ${toneMap[tone]} p-5`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">
            {value}
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{hint}</p>
        </div>
        {Icon ? (
          <div className="rounded-2xl bg-white/80 p-3 shadow-sm dark:bg-white/10">
            <Icon className="size-5 text-brand" />
          </div>
        ) : null}
      </div>
    </Card>
  );
}
