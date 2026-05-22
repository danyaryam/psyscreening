import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, MailCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema } from "@/utils/validation";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, loginWithGoogle } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
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
      const response = await registerUser(values);
      setSuccessMessage(
        response.message ||
          "Registrasi berhasil. Silakan cek email Anda, lalu klik Verifikasi Email untuk langsung masuk ke dashboard.",
      );
      reset();
    } catch (error) {
      toast.error(error.message || "Registrasi gagal.");
    } finally {
      setSubmitting(false);
    }
  });

  const handleGoogleCredential = async (credential) => {
    setGoogleSubmitting(true);
    try {
      const user = await loginWithGoogle(credential);
      navigate(user.role === "admin" ? "/admin/dashboard" : "/app/dashboard", {
        replace: true,
      });
    } catch (error) {
      toast.error(error.message || "Registrasi Google gagal.");
    } finally {
      setGoogleSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto w-full max-w-xl p-7 sm:p-8">
      <div className="space-y-3">
        <span className="inline-flex rounded-full bg-accent-soft px-4 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
          Buat Akun
        </span>
        <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">
          Buat akun baru
        </h1>
      </div>

      {successMessage ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-7 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100">
          <div className="mb-2 flex items-center gap-2 font-semibold">
            <MailCheck className="size-4" />
            Cek email verifikasi Anda
          </div>
          {successMessage}
        </div>
      ) : null}

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
        <PasswordInput
          label="Password"
          placeholder="Minimal 8 karakter"
          error={errors.password?.message}
          {...register("password")}
        />
        <PasswordInput
          label="Konfirmasi Password"
          placeholder="Ulangi password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button type="submit" className="w-full" loading={submitting}>
          Daftar dan Verifikasi Email
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
        atau
        <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
      </div>

      <GoogleAuthButton
        mode="register"
        disabled={googleSubmitting}
        onCredential={handleGoogleCredential}
        onError={() => toast.error("Google register dibatalkan atau gagal.")}
      />

      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        Sudah punya akun?{" "}
        <Link to="/login" className="font-semibold text-brand">
          Login di sini
        </Link>
      </p>
    </Card>
  );
}
