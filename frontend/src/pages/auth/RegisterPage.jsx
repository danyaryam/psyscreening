import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema } from "@/utils/validation";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      await registerUser(values);
      navigate("/app/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.message || "Registrasi gagal.");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Card className="mx-auto w-full max-w-xl p-7 sm:p-8">
      <div className="space-y-3">
        <span className="inline-flex rounded-full bg-accent-soft px-4 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
          Buat Akun
        </span>
        <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">
          Buat akun baru
        </h1>
        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
          Daftar untuk menyimpan hasil screening dan memantau kondisi Anda secara lebih terarah.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <Input
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Email"
          type="email"
          placeholder="nama@domain.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Minimal 8 karakter"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Konfirmasi Password"
          type="password"
          placeholder="Ulangi password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button type="submit" className="w-full" loading={submitting}>
          Daftar dan Mulai
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600 dark:bg-white/5 dark:text-slate-300">
        <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
          <Sparkles className="size-4 text-accent" />
          Setelah akun aktif
        </div>
        Anda akan langsung diarahkan ke dashboard dan dapat memulai screening kapan saja.
      </div>

      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        Sudah punya akun?{" "}
        <Link to="/login" className="font-semibold text-brand">
          Login di sini
        </Link>
      </p>
    </Card>
  );
}
