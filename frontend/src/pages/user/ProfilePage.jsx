import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { Textarea } from "@/components/ui/Textarea";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/userService";
import { profileSchema } from "@/utils/validation";

const yesNoOptions = [
  { label: "Pilih jawaban", value: "" },
  { label: "yes", value: "yes" },
  { label: "no", value: "no" },
];

export function ProfilePage() {
  const { updateSessionUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      phone: "",
      occupation: "",
      city: "",
      birthDate: "",
      gender: "",
      bio: "",
      emergencyContact: "",
      age: "",
      country: "",
      self_employed: "",
      family_history: "",
      no_employees: "",
      remote_work: "",
      coworkers: "",
    },
  });

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        const response = await userService.getProfile();
        if (!mounted) return;

        reset({
          name: response.user.name,
          phone: response.profile?.phone ?? "",
          occupation: response.profile?.occupation ?? "",
          city: response.profile?.city ?? "",
          birthDate: response.profile?.birthDate ?? "",
          gender: response.profile?.gender ?? "",
          bio: response.profile?.bio ?? "",
          emergencyContact: response.profile?.emergencyContact ?? "",
          age: response.profile?.age ?? "",
          country: response.profile?.country ?? "",
          self_employed: response.profile?.self_employed ?? "",
          family_history: response.profile?.family_history ?? "",
          no_employees: response.profile?.no_employees ?? "",
          remote_work: response.profile?.remote_work ?? "",
          coworkers: response.profile?.coworkers ?? "",
        });
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [reset]);

  const onSubmit = handleSubmit(async (values) => {
    setSaving(true);
    try {
      const response = await userService.updateProfile(values);
      updateSessionUser(response.user);
      toast.success("Profil berhasil diperbarui.");
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan profil.");
    } finally {
      setSaving(false);
    }
  });

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
        eyebrow="Profil User"
        title="Kelola profil personal"
        description="Lengkapi data profil untuk membantu konteks screening dan kebutuhan tindak lanjut yang lebih terarah."
      />

      <Card>
        <form onSubmit={onSubmit} className="grid gap-5 md:grid-cols-2">
          <Input
            label="Nama Lengkap"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Nomor Telepon"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Input
            label="Pekerjaan / Aktivitas Utama"
            {...register("occupation")}
          />
          <Input label="Kota" {...register("city")} />
          <Input label="Tanggal Lahir" type="date" {...register("birthDate")} />
          <Input label="Gender" placeholder="Contoh: Perempuan" {...register("gender")} />

          <div className="md:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Data konteks screening
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Data berikut membantu sistem memahami konteks umum untuk kebutuhan screening awal.
              </p>
            </div>
          </div>

          <Input
            label="Age"
            type="number"
            min="1"
            max="120"
            inputMode="numeric"
            error={errors.age?.message}
            {...register("age")}
          />
          <Input
            label="Country"
            placeholder="Contoh: Indonesia"
            error={errors.country?.message}
            {...register("country")}
          />
          <Select
            label="Self Employed"
            error={errors.self_employed?.message}
            {...register("self_employed")}
          >
            {yesNoOptions.map((option) => (
              <option key={option.value || "empty"} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Select
            label="Family History"
            error={errors.family_history?.message}
            {...register("family_history")}
          >
            {yesNoOptions.map((option) => (
              <option key={option.value || "empty"} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Select
            label="No Employees"
            error={errors.no_employees?.message}
            {...register("no_employees")}
          >
            {yesNoOptions.map((option) => (
              <option key={option.value || "empty"} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Select
            label="Remote Work"
            error={errors.remote_work?.message}
            {...register("remote_work")}
          >
            {yesNoOptions.map((option) => (
              <option key={option.value || "empty"} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Select
            label="Coworkers"
            error={errors.coworkers?.message}
            {...register("coworkers")}
          >
            {yesNoOptions.map((option) => (
              <option key={option.value || "empty"} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <div className="md:col-span-2">
            <Textarea
              label="Bio Singkat"
              rows={4}
              error={errors.bio?.message}
              {...register("bio")}
            />
          </div>
          <div className="md:col-span-2">
            <Input
              label="Kontak Darurat"
              placeholder="Nama dan nomor kontak yang bisa dihubungi"
              {...register("emergencyContact")}
            />
          </div>

          <div className="md:col-span-2">
            <Button type="submit" loading={saving}>
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
