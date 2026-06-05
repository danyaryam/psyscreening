import { Badge } from "./Badge";

export function PageHeader({ eyebrow, title, description, badge }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {eyebrow ? <Badge tone="brand">{eyebrow}</Badge> : null}
        {badge}
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}
