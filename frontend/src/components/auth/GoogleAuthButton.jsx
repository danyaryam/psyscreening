import { GoogleLogin } from "@react-oauth/google";
import { env } from "@/config/env";

export function GoogleAuthButton({ mode = "login", disabled = false, onCredential, onError }) {
  if (!env.googleClientId) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
        Google OAuth belum aktif. Isi VITE_GOOGLE_CLIENT_ID untuk menampilkan tombol Google.
      </div>
    );
  }

  return (
    <div className={disabled ? "pointer-events-none opacity-60" : ""}>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (!credentialResponse.credential) {
            onError?.();
            return;
          }

          onCredential(credentialResponse.credential);
        }}
        onError={onError}
        text={mode === "register" ? "signup_with" : "signin_with"}
        shape="pill"
        size="large"
        width="100%"
      />
    </div>
  );
}
