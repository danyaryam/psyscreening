import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema } from "@/utils/validation";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const user = await login(values);
      const destination =
        location.state?.from?.pathname ??
        (user.role === "admin" ? "/admin/dashboard" : "/app/dashboard");
      navigate(destination, { replace: true });
    } catch (error) {
      toast.error(error.message || "Login gagal.");
    } finally {
      setSubmitting(false);
    }
  });

  const fillDemo = (role) => {
    if (role === "admin") {
      setValue("email", "admin@psyscreening.id");
      setValue("password", "Admin123!");
    } else {
      setValue("email", "dina@psyscreening.id");
      setValue("password", "User123!");
    }
  };

  return (
    <Card className="mx-auto w-full max-w-xl p-7 sm:p-8">
      <div className="space-y-3">
        <span className="inline-flex rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-brand-deep">
          Masuk Aman
        </span>
        <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">
          Masuk ke PsyScreening
        </h1>
        <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
          Akses hasil screening, riwayat, dan pemantauan kondisi Anda dari satu tempat.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => fillDemo("user")}
          className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200"
        >
          Isi akun demo user
        </button>
        <button
          type="button"
          onClick={() => fillDemo("admin")}
          className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200"
        >
          Isi akun demo admin
        </button>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
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
          placeholder="Masukkan password"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" className="w-full" loading={submitting}>
          Login
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-600 dark:bg-white/5 dark:text-slate-300">
        <div className="mb-2 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
          <ShieldCheck className="size-4 text-brand" />
          Privasi dan akses
        </div>
        Akun Anda digunakan untuk menjaga akses ke data screening dan riwayat
        sesuai hak akses masing-masing pengguna.
      </div>

      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        Belum punya akun?{" "}
        <Link to="/register" className="font-semibold text-brand">
          Buat akun baru
        </Link>
      </p>
    </Card>
  );
}
