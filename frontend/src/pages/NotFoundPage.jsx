import { Compass, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-2xl text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-brand-soft text-brand">
          <Compass className="size-8" />
        </div>
        <h1 className="mt-6 text-4xl font-semibold text-slate-950 dark:text-white">
          404
        </h1>
        <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
          Halaman tidak ditemukan
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          Sepertinya halaman yang Anda cari sudah berpindah atau belum tersedia.
        </p>
        <div className="mt-8">
          <Link to="/">
            <Button>
              <Home className="size-4" />
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
