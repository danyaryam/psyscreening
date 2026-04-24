import { ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiskBadge } from "@/components/screening/RiskBadge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { screeningService } from "@/services/screeningService";
import { formatDate } from "@/utils/format";

export function HistoryPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function loadHistory() {
      try {
        const response = await screeningService.getAll();
        if (mounted) {
          setItems(response.items);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-[420px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Riwayat Screening"
        title="Semua hasil screening Anda"
        description="Telusuri hasil sebelumnya untuk memantau pola risiko, skor, dan insight penting dari waktu ke waktu."
      />

      {items.length ? (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left dark:divide-white/10">
              <thead className="bg-slate-50 dark:bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Model
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Risiko
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Skor
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-5 text-sm text-slate-700 dark:text-slate-200">
                      {formatDate(item.completedAt, { withTime: true })}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-700 dark:text-slate-200">
                      {item.result?.modelUsed}
                    </td>
                    <td className="px-6 py-5">
                      <RiskBadge riskLevel={item.result?.riskLevel} />
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-slate-950 dark:text-white">
                      {item.result?.score}/100
                    </td>
                    <td className="px-6 py-5">
                      <Link
                        to={`/app/results/${item.id}`}
                        className="text-sm font-semibold text-brand"
                      >
                        Detail hasil
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <EmptyState
          icon={ClipboardList}
          title="Belum ada riwayat screening"
          description="Setelah Anda menyelesaikan sesi screening, hasilnya akan otomatis tersimpan di halaman ini."
          actionLabel="Mulai Screening"
          onAction={() => navigate("/app/screening/new")}
        />
      )}
    </div>
  );
}
