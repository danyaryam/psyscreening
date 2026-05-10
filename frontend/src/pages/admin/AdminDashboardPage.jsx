import { Activity, BarChart3, ClipboardList, Users2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/dashboard/StatCard";
import { adminService } from "@/services/adminService";
import { formatDate } from "@/utils/format";

export function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadStats() {
      try {
        const response = await adminService.getStats();
        if (mounted) {
          setStats(response);
          setError("");
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError.message || "Gagal memuat statistik admin.");
          toast.error(loadError.message || "Gagal memuat statistik admin.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
        </div>
        <Skeleton className="h-[360px] w-full" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Statistik admin belum tersedia"
        description={error || "Data statistik tidak berhasil dimuat dari server."}
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Dashboard Admin"
        title="Ringkasan layanan screening"
        description="Pantau pengguna, hasil screening, distribusi risiko, dan aktivitas sistem dari satu tempat."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users2}
          label="Total User"
          value={stats.summary.totalUsers}
          hint="Jumlah akun pengguna yang terdaftar."
        />
        <StatCard
          icon={ClipboardList}
          label="Screening Selesai"
          value={stats.summary.totalScreenings}
          hint="Sesi screening yang telah selesai."
          tone="accent"
        />
        <StatCard
          icon={BarChart3}
          label="Rata-rata Skor"
          value={`${stats.summary.averageScore}/100`}
          hint="Rata-rata skor dari seluruh hasil screening."
          tone="warning"
        />
        <StatCard
          icon={Activity}
          label="Pertanyaan Aktif"
          value={stats.summary.activeQuestions}
          hint="Pertanyaan guided screening yang sedang digunakan."
          tone="success"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-5">
          <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
            Distribusi risiko
          </h2>
          {["rendah", "sedang", "tinggi"].map((level) => {
            const total =
              stats.riskCounts.rendah + stats.riskCounts.sedang + stats.riskCounts.tinggi;
            const value = stats.riskCounts[level];
            const width = total ? Math.round((value / total) * 100) : 0;
            const color =
              level === "tinggi"
                ? "bg-rose-500"
                : level === "sedang"
                  ? "bg-amber-500"
                  : "bg-emerald-500";

            return (
              <div key={level} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold capitalize text-slate-900 dark:text-white">
                    {level}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    {value} hasil
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} />
                </div>
              </div>
            );
          })}
        </Card>

        <Card className="space-y-5">
          <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
            Aktivitas admin terbaru
          </h2>
          <div className="space-y-4">
            {stats.recentLogs.map((log) => (
              <div
                key={log.id}
                className="rounded-2xl border border-slate-200 px-4 py-4 dark:border-white/10"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {log.description}
                  </p>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {log.action}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {log.admin?.name} - {formatDate(log.createdAt, { withTime: true })}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
