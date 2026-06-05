import { CheckCircle2, MailCheck, RefreshCw, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import { getStoredToken, setStoredToken } from "@/services/http";

const VERIFIED_TOKEN_PREFIX = "psyscreening_verified_email_token:";

function getDashboardPath(user) {
  return user?.role === "admin" ? "/admin/dashboard" : "/app/dashboard";
}

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const { updateSessionUser } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Memverifikasi email Anda...");
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [dashboardPath, setDashboardPath] = useState("/app/dashboard");
  const hasStartedVerification = useRef(false);

  useEffect(() => {
    let mounted = true;

    function rememberVerifiedToken(nextPath) {
      if (!token) return;
      try {
        window.sessionStorage.setItem(`${VERIFIED_TOKEN_PREFIX}${token}`, nextPath);
      } catch {
        // Session storage can be unavailable in strict browser/privacy contexts.
      }
    }

    function getRememberedDashboardPath() {
      if (!token) return null;
      try {
        return window.sessionStorage.getItem(`${VERIFIED_TOKEN_PREFIX}${token}`);
      } catch {
        return null;
      }
    }

    async function verify() {
      if (hasStartedVerification.current) {
        return;
      }

      hasStartedVerification.current = true;

      if (!token) {
        setStatus("error");
        setMessage("Token verifikasi tidak ditemukan.");
        return;
      }

      const rememberedPath = getRememberedDashboardPath();

      if (rememberedPath && getStoredToken()) {
        navigate(rememberedPath, { replace: true });
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        if (mounted) {
          if (response.token && response.user) {
            setStoredToken(response.token);
            updateSessionUser(response.user);
            toast.success("Email berhasil diverifikasi.");
            const nextPath = getDashboardPath(response.user);
            rememberVerifiedToken(nextPath);
            setDashboardPath(nextPath);
            setStatus("success");
            setMessage(
              response.message ||
                "Email berhasil diverifikasi. Mengalihkan ke dashboard...",
            );
            navigate(nextPath, { replace: true });
            return;
          }

          setStatus("success");
          setMessage(
            response.message || "Email berhasil diverifikasi. Silakan lanjut ke dashboard.",
          );
        }
      } catch (error) {
        if (mounted) {
          setStatus("error");
          setMessage(error.message || "Verifikasi email gagal.");
        }
      }
    }

    verify();

    return () => {
      mounted = false;
    };
  }, [navigate, token, updateSessionUser]);

  const handleResend = async () => {
    if (!email.trim()) {
      toast.error("Masukkan email terlebih dahulu.");
      return;
    }

    setResending(true);
    try {
      const response = await authService.resendVerification(email.trim());
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message || "Gagal mengirim ulang verifikasi.");
    } finally {
      setResending(false);
    }
  };

  const isSuccess = status === "success";
  const isLoading = status === "loading";

  return (
    <Card className="mx-auto w-full max-w-xl p-7 sm:p-8">
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          {isLoading ? (
            <RefreshCw className="size-5 animate-spin" />
          ) : isSuccess ? (
            <CheckCircle2 className="size-5" />
          ) : (
            <XCircle className="size-5" />
          )}
        </div>
        <div className="space-y-3">
          <span className="inline-flex rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-brand-deep">
            Verifikasi Email
          </span>
          <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">
            {isSuccess ? "Email berhasil diverifikasi" : "Konfirmasi akun PsyScreening"}
          </h1>
          <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
            {message}
          </p>
        </div>
      </div>

      {isSuccess ? (
        <Button
          type="button"
          className="mt-8 w-full"
          onClick={() => navigate(dashboardPath, { replace: true })}
        >
          Lanjut ke Dashboard
        </Button>
      ) : null}

      {!isLoading && !isSuccess ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <MailCheck className="size-4 text-brand" />
            Kirim ulang link verifikasi
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nama@domain.com"
            />
            <Button
              type="button"
              variant="secondary"
              className="self-end"
              loading={resending}
              onClick={handleResend}
            >
              Kirim Ulang
            </Button>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
