import { Button } from "./Button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center dark:border-white/10 dark:bg-white/5">
      {Icon ? (
        <div className="mb-4 rounded-2xl bg-brand-soft p-4 text-brand">
          <Icon className="size-6" />
        </div>
      ) : null}
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
        {description}
      </p>
      {actionLabel ? (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
