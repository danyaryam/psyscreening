export function LoadingScreen({ title = "Memuat aplikasi..." }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass flex w-full max-w-md flex-col items-center gap-5 px-8 py-12 text-center">
        <div className="size-14 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {title}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            PsyScreening sedang menyiapkan pengalaman screening Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
