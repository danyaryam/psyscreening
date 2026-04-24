import { CheckCircle2 } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

export function AnswerSummary({ answers, onSubmit, loading }) {
  return (
    <Card className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
          <CheckCircle2 className="size-5" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-950 dark:text-white">
            Ringkasan jawaban siap dikirim
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Tinjau jawaban utama sebelum diproses oleh model screening.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {answers.map((item) => (
          <div
            key={item.questionId}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-white/10 dark:bg-white/5"
          >
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {item.title}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <Button onClick={onSubmit} loading={loading}>
        Proses Hasil Screening
      </Button>
    </Card>
  );
}
