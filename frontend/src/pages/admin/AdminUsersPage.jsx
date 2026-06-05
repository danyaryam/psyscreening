import { Search, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { RiskBadge } from "@/components/screening/RiskBadge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { adminService } from "@/services/adminService";
import { formatDate } from "@/utils/format";

export function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadUsers() {
      try {
        const response = await adminService.getUsers();
        if (mounted) {
          setUsers(response.items);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [search, users],
  );

  const handleSelectUser = async (userId) => {
    setDetailLoading(true);
    try {
      const response = await adminService.getUserById(userId);
      setSelectedUser(response.item);
    } catch (error) {
      toast.error(error.message || "Gagal memuat detail user.");
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-[520px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin User Management"
        title="Kelola data user"
        description="Lihat user terdaftar, ringkasan screening terakhir, dan detail profil yang relevan untuk monitoring."
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="space-y-5">
          <div className="space-y-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Cari user
            </span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari berdasarkan nama atau email"
                className="pl-11"
              />
            </div>
          </div>

          {filteredUsers.length ? (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelectUser(user.id)}
                  className="w-full rounded-[28px] border border-slate-200 px-5 py-5 text-left transition hover:border-brand hover:bg-brand-soft dark:border-white/10 dark:hover:bg-white/5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-slate-950 dark:text-white">
                        {user.name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {user.email}
                      </p>
                    </div>
                    {user.latestRiskLevel ? (
                      <RiskBadge riskLevel={user.latestRiskLevel} />
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500 dark:bg-white/10 dark:text-slate-300">
                        Belum screening
                      </span>
                    )}
                  </div>
                  <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
                    <p>Screening: {user.screeningsCount}</p>
                    <p>Score terakhir: {user.latestScore ?? "-"}</p>
                    <p>Tanggal terakhir: {user.latestScreeningAt ? formatDate(user.latestScreeningAt) : "-"}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="User tidak ditemukan"
              description="Coba kata kunci lain untuk menampilkan user yang ingin Anda buka."
            />
          )}
        </Card>

        <Card className="space-y-5">
          <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">
            Detail user
          </h2>

          {detailLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-44 w-full" />
            </div>
          ) : selectedUser ? (
            <div className="space-y-5">
              <div className="rounded-[28px] bg-gradient-to-br from-brand-soft to-accent-soft p-5 dark:from-brand/25 dark:to-accent/20 dark:ring-1 dark:ring-white/10">
                <p className="text-xl font-semibold text-slate-950 dark:text-white">
                  {selectedUser.name}
                </p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-200">
                  {selectedUser.email}
                </p>
              </div>

              <div className="grid gap-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                <p>Pekerjaan: {selectedUser.profile?.occupation || "-"}</p>
                <p>Kota: {selectedUser.profile?.city || "-"}</p>
                <p>Telepon: {selectedUser.profile?.phone || "-"}</p>
                <p>Kontak Darurat: {selectedUser.profile?.emergencyContact || "-"}</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Riwayat screening
                </p>
                {selectedUser.screenings.length ? (
                  selectedUser.screenings.map((screening) => (
                    <div
                      key={screening.id}
                      className="rounded-2xl border border-slate-200 px-4 py-4 dark:border-white/10"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <RiskBadge riskLevel={screening.result?.riskLevel} />
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {formatDate(screening.completedAt)}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                        Skor: {screening.result?.score ?? "-"} | Model: {screening.result?.modelUsed ?? "-"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                    User ini belum memiliki data screening.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
              Pilih salah satu user dari daftar di kiri untuk melihat detail profil dan riwayat screening.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
