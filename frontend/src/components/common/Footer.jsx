import { Link } from "react-router-dom";
import { MEDICAL_DISCLAIMER } from "@/utils/constants";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/50 py-12 dark:border-white/10">
      <div className="container-shell space-y-8">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              PsyScreening adalah platform screening awal kesehatan mental yang
              membantu pengguna memahami kondisi emosional dan pola keseharian
              secara lebih terarah, aman, dan mudah dipahami.
            </p>
            <p className="rounded-2xl bg-brand-soft px-4 py-3 text-sm text-brand-deep">
              {MEDICAL_DISCLAIMER}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Navigasi
            </h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600 dark:text-slate-300">
              <Link to="/">Beranda</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Product Notes
            </h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p>Screening awal dengan alur percakapan yang terarah.</p>
              <p>Hasil dirangkum secara jelas untuk membantu langkah tindak lanjut.</p>
              <p>Dirancang untuk menjaga privasi, kenyamanan, dan kemudahan penggunaan.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/50 pt-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
          © Hak Cipta 2026 PsyScreening. Seluruh hak dilindungi.
        </div>
      </div>
    </footer>
  );
}
