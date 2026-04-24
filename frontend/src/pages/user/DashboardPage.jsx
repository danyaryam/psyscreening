import { Activity, ArrowRight, ClipboardList, HeartPulse, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/dashboard/StatCard";
import { RiskBadge } from "@/components/screening/RiskBadge";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/userService";
import { formatDate } from "@/utils/format";
import { MEDICAL_DISCLAIMER } from "@/utils/constants";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [profileResponse, historyResponse] = await Promise.all([
          userService.getProfile(),
          userService.getHistory(),
        ]);

        if (!mounted) return;
        setProfile(profileResponse.profile);
        setHistory(historyResponse.items);
        setError("");
      } catch (loadError) {
        if (mounted) {
          setError(loadError.message || "Gagal memuat dashboard.");
          toast.error(loadError.message || "Gagal memuat dashboard.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const latestResult = history[0]?.result;

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
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Dashboard User"
        title={`Halo ${user?.name?.split(" ")[0]}, selamat datang.`}
        description="Pantau hasil terbaru dan lanjutkan screening kapan pun Anda perlukan."
        badge={<Badge tone="brand">Akun Aktif</Badge>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={ClipboardList}
          label="Total Screening"
          value={history.length}
          hint="Riwayat sesi yang berhasil tersimpan."
        />
        <StatCard
          icon={HeartPulse}
          label="Skor Terakhir"
          value={latestResult ? `${latestResult.score}/100` : "-"}
          hint="Ringkasan dari hasil screening terbaru."
          tone="accent"
        />
        <StatCard
          icon={Activity}
          label="Level Risiko"
          value={latestResult ? latestResult.riskLevel.toUpperCase() : "-"}
          hint="Dihitung dari pola aktivitas, stres, dan tidur."
          tone="warning"
        />
        <StatCard
          icon={ShieldCheck}
          label="Status Akun"
          value="Active"
          hint="Akun siap digunakan untuk screening lanjutan."
          tone="success"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
                Mulai screening baru
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Flow chat akan memandu Anda selangkah demi selangkah dan
                menghasilkan insight yang mudah dipahami.
              </p>
            </div>
            <Link to="/app/screening/new">
              <Button>
                Buka Chat Screening
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[28px] bg-gradient-to-br from-brand-soft to-accent-soft p-6 dark:from-brand/25 dark:to-accent/20 dark:ring-1 dark:ring-white/10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">
                Profil Singkat
              </p>
              <p className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">
                {profile?.occupation || "Lengkapi profil Anda"}
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-200">
                {profile?.city
                  ? `Berdomisili di ${profile.city}.`
                  : "Lengkapi kota, pekerjaan, dan kontak darurat untuk membantu konteks screening."}
              </p>
              <Link
                to="/app/profile"
                className="mt-5 inline-flex text-sm font-semibold text-brand dark:text-sky-300"
              >
                Kelola profil
              </Link>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white/70 p-6 dark:border-white/10 dark:bg-white/5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Catatan Penting
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {error
                  ? `${error} Anda tetap bisa mencoba memuat ulang atau login ulang.`
                  : MEDICAL_DISCLAIMER}
              </p>
            </div>
          </div>
        </Card>

        <Card className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
              Screening Terakhir
            </h2>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Snapshot singkat dari hasil terbaru Anda.
            </p>
          </div>

          {latestResult ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <RiskBadge riskLevel={latestResult.riskLevel} />
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {formatDate(history[0].completedAt)}
                </span>
              </div>

              <div className="rounded-[28px] bg-slate-50/90 p-5 dark:bg-white/5">
                <p className="text-4xl font-semibold text-slate-950 dark:text-white">
                  {latestResult.score}
                  <span className="text-lg text-slate-400">/100</span>
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Model: {latestResult.modelUsed}
                </p>
              </div>

              <div className="space-y-3">
                {latestResult.insights.map((insight) => (
                  <div
                    key={insight}
                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-7 text-slate-600 dark:border-white/10 dark:text-slate-300"
                  >
                    {insight}
                  </div>
                ))}
              </div>

              <Link to={`/app/results/${history[0].id}`}>
                <Button variant="secondary" className="w-full">
                  Lihat Detail Hasil
                </Button>
              </Link>
            </div>
          ) : (
            <EmptyState
              icon={ClipboardList}
              title="Belum ada screening tersimpan"
              description="Mulai sesi screening pertama Anda untuk mendapatkan insight awal."
              actionLabel="Mulai Sekarang"
              onAction={() => navigate("/app/screening/new")}
            />
          )}
        </Card>
      </div>

      <Card className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
              Riwayat terbaru
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Lihat perbandingan hasil screening dari waktu ke waktu.
            </p>
          </div>
          <Link to="/app/history" className="text-sm font-semibold text-brand">
            Lihat semua
          </Link>
        </div>

        {history.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {history.slice(0, 3).map((item) => (
              <Card key={item.id} className="p-5">
                <div className="flex items-center justify-between">
                  <RiskBadge riskLevel={item.result?.riskLevel} />
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {formatDate(item.completedAt)}
                  </span>
                </div>
                <p className="mt-5 text-3xl font-semibold text-slate-950 dark:text-white">
                  {item.result?.score}
                  <span className="text-base text-slate-400">/100</span>
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {item.result?.modelUsed}
                </p>
                <Link to={`/app/results/${item.id}`} className="mt-5 inline-flex text-sm font-semibold text-brand">
                  Lihat detail
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="Riwayat belum tersedia"
            description="Hasil screening Anda akan muncul di sini setelah sesi pertama selesai."
          />
        )}
      </Card>
    </div>
  );
}
