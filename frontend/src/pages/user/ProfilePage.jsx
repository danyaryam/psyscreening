import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { Textarea } from "@/components/ui/Textarea";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/userService";
import { profileSchema } from "@/utils/validation";

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
            <Textarea label="Bio Singkat" rows={4} {...register("bio")} />
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
