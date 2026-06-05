import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, MailCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { loginSchema } from "@/utils/validation";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resendSubmitting, setResendSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
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
      if (error.message?.toLowerCase().includes("belum diverifikasi")) {
        setShowResend(true);
        setResendEmail(values.email);
      }
      toast.error(error.message || "Login gagal.");
    } finally {
      setSubmitting(false);
    }
  });

  const navigateAfterAuth = (user) => {
    const destination =
      location.state?.from?.pathname ??
      (user.role === "admin" ? "/admin/dashboard" : "/app/dashboard");
    navigate(destination, { replace: true });
  };

  const handleGoogleCredential = async (credential) => {
    setGoogleSubmitting(true);
    try {
      const user = await loginWithGoogle(credential);
      navigateAfterAuth(user);
    } catch (error) {
      toast.error(error.message || "Login Google gagal.");
    } finally {
      setGoogleSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    const email = (resendEmail || watch("email")).trim();

    if (!email) {
      toast.error("Masukkan email terlebih dahulu.");
      return;
    }

    setResendSubmitting(true);
    try {
      const response = await authService.resendVerification(email);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message || "Gagal mengirim ulang verifikasi.");
    } finally {
      setResendSubmitting(false);
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
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <Input
          label="Email"
          type="email"
          placeholder="nama@domain.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <PasswordInput
          label="Password"
          placeholder="Masukkan password"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" className="w-full" loading={submitting}>
          Login
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
        atau
        <span className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
      </div>

      <GoogleAuthButton
        mode="login"
        disabled={googleSubmitting}
        onCredential={handleGoogleCredential}
        onError={() => toast.error("Google login dibatalkan atau gagal.")}
      />

      {!showResend ? (
        <button
          type="button"
          onClick={() => {
            setShowResend(true);
            setResendEmail(watch("email"));
          }}
          className="mt-4 text-sm font-semibold text-brand hover:text-brand-deep dark:hover:text-brand-soft"
        >
          Belum menerima email verifikasi? Kirim ulang
        </button>
      ) : null}

      {showResend ? (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-7 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
          <div className="mb-3 flex items-center gap-2 font-semibold">
            <MailCheck className="size-4" />
            Email belum diverifikasi
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <Input
              label="Email verifikasi"
              type="email"
              value={resendEmail}
              onChange={(event) => setResendEmail(event.target.value)}
              placeholder="nama@domain.com"
            />
            <Button
              type="button"
              variant="secondary"
              className="self-end"
              loading={resendSubmitting}
              onClick={handleResendVerification}
            >
              Kirim Ulang
            </Button>
          </div>
        </div>
      ) : null}

      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        Belum punya akun?{" "}
        <Link to="/register" className="font-semibold text-brand">
          Buat akun baru
        </Link>
      </p>
    </Card>
  );
}
