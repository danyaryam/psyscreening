import { ProgressBar } from "../ui/ProgressBar";

export function ScreeningProgress({ current, total, progress }) {
  return (
    <div className="space-y-3 rounded-[28px] border border-slate-200 bg-white/80 p-5 dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Progress screening
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Pertanyaan {current} dari {total}
          </p>
        </div>
        <div className="text-sm font-semibold text-brand">{progress}%</div>
      </div>
      <ProgressBar value={progress} />
    </div>
  );
}
