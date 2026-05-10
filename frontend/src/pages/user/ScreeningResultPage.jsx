import { AlertTriangle, ArrowRight, BrainCircuit, Lightbulb, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RiskBadge } from "@/components/screening/RiskBadge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { screeningService } from "@/services/screeningService";
import { formatDate } from "@/utils/format";

export function ScreeningResultPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadResult() {
      try {
        const response = await screeningService.getById(id);
        if (!mounted) return;
        setItem(response.item);
      } catch (loadError) {
        if (mounted) {
          setError(loadError.message || "Gagal memuat hasil screening.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadResult();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-[520px] w-full" />
      </div>
    );
  }

  if (error || !item?.result) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Hasil screening tidak ditemukan"
        description={error || "Data hasil screening belum tersedia untuk sesi ini."}
        actionLabel="Kembali ke Riwayat"
        onAction={() => navigate("/app/history")}
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Screening Result"
        title="Hasil analisis screening"
        description="Ringkasan ini disusun dari jawaban guided conversation dan prediksi model screening yang aktif."
        badge={<RiskBadge riskLevel={item.result.riskLevel} />}
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Tanggal screening
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                {formatDate(item.completedAt, { withTime: true })}
              </p>
            </div>
            <div className="rounded-[28px] bg-gradient-to-br from-brand-soft to-accent-soft px-6 py-5 text-center dark:from-brand/25 dark:to-accent/25 dark:ring-1 dark:ring-white/10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
                Score
              </p>
              <p className="mt-3 text-5xl font-semibold text-slate-950 dark:text-white">
                {item.result.score}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                dari 100
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 px-4 py-4 dark:border-white/10">
              <p className="text-sm text-slate-500 dark:text-slate-400">Model digunakan</p>
              <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                {item.result.modelUsed}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 px-4 py-4 dark:border-white/10">
              <p className="text-sm text-slate-500 dark:text-slate-400">Status hasil</p>
              <div className="mt-2">
                <RiskBadge riskLevel={item.result.riskLevel} />
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
            {item.result.disclaimer}
          </div>
        </Card>

        <Card className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-soft p-3 text-brand">
              <BrainCircuit className="size-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
                Insight utama
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Temuan ringkas yang paling menonjol dari sesi screening ini.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {item.result.insights.map((insight) => (
              <div
                key={insight}
                className="rounded-2xl border border-slate-200 px-4 py-4 text-sm leading-7 text-slate-600 dark:border-white/10 dark:text-slate-300"
              >
                {insight}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
              <Lightbulb className="size-5" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
              Rekomendasi singkat
            </h2>
          </div>
          <div className="space-y-3">
            {item.result.recommendations.map((recommendation) => (
              <div
                key={recommendation}
                className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600 dark:bg-white/5 dark:text-slate-300"
              >
                {recommendation}
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-accent-soft p-3 text-accent">
              <Sparkles className="size-5" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
              Ringkasan jawaban
            </h2>
          </div>
          <div className="space-y-3">
            {item.summary.map((summary) => (
              <div
                key={summary.questionId}
                className="rounded-2xl border border-slate-200 px-4 py-4 dark:border-white/10"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {summary.title}
                </p>
                <p className="mt-1 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {summary.value}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link to="/app/history">
          <Button variant="secondary">Kembali ke Riwayat</Button>
        </Link>
        <Link to="/app/screening/new">
          <Button>
            Screening Baru
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
