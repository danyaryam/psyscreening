import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  MessageSquareHeart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  faqs,
  heroMetrics,
  landingBenefits,
  landingFeatures,
  landingSteps,
  testimonials,
  trustIndicators,
} from "@/data/landing";
import { MEDICAL_DISCLAIMER } from "@/utils/constants";

export function LandingPage() {
  return (
    <div className="overflow-hidden">
      <section className="relative isolate py-14 sm:py-20">
        <div className="container-shell grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-brand/20 bg-brand-soft px-4 py-2 text-sm font-semibold text-brand-deep">
              Screening Awal Kesehatan Mental
            </div>

            <div className="space-y-6">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
                Jangan hadapi beban mental sendirian.
                <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
                  {" "}
                  Mulai langkah awal yang tepat.
                </span>
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
                PsyScreening membantu Anda meninjau kondisi mental awal melalui
                percakapan terarah, analisis pola keseharian, dan hasil screening
                yang disampaikan dengan jelas dan mudah dipahami.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/register">
                <Button size="lg">
                  Mulai Screening
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="secondary">
                  Masuk ke Chat
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:max-w-xl">
              {heroMetrics.map((metric) => (
                <Card key={metric.label} className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-brand-soft p-3 text-brand">
                      <metric.icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        {metric.label}
                      </p>
                      <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-white">
                        {metric.value}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="glass relative overflow-hidden p-6 sm:p-7">
              <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-accent/20 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-brand/20 blur-3xl" />

              <div className="relative space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-950 dark:text-white">
                      Guided Conversation Preview
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Flow seperti chat, bukan form panjang yang melelahkan.
                    </p>
                  </div>
                  <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                    AI/ML Ready
                  </div>
                </div>

                <div className="space-y-3 rounded-[28px] bg-slate-50/90 p-4 dark:bg-slate-950/50">
                  <div className="max-w-[85%] rounded-[22px] rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-50">
                    Halo, saya akan memandu screening singkat. Berapa jam rata-rata
                    Anda tidur dalam 7 hari terakhir?
                  </div>
                  <div className="ml-auto max-w-[70%] rounded-[22px] rounded-br-md bg-gradient-to-br from-brand to-brand-deep px-4 py-3 text-sm leading-7 text-white shadow-glow">
                    Sekitar 5 sampai 6 jam per malam.
                  </div>
                  <div className="max-w-[85%] rounded-[22px] rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-700 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-50">
                    Seberapa tinggi tingkat stres harian Anda saat ini?
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[4, 5, 6, 7].map((item) => (
                      <div
                        key={item}
                        className={`rounded-2xl px-3 py-3 text-center text-sm font-semibold ${
                          item === 7
                            ? "bg-brand text-white"
                            : "border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Model
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-950 dark:text-white">
                      Random Forest
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Risk Level
                    </p>
                    <p className="mt-2 text-sm font-semibold text-amber-600">
                      Sedang
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/70 p-4 dark:bg-white/5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Score
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-950 dark:text-white">
                      68 / 100
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {trustIndicators.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-4 dark:border-white/10 dark:bg-white/5"
                >
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" className="py-20">
        <div className="container-shell">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex rounded-full bg-accent-soft px-4 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
              Fitur Utama
            </span>
            <h2 className="text-3xl font-semibold text-slate-950 dark:text-white sm:text-4xl">
              Fitur utama untuk screening awal yang lebih terarah.
            </h2>
            <p className="text-base leading-8 text-slate-600 dark:text-slate-300">
              Mulai dari chat screening terarah, hasil analisis yang mudah
              dipahami, riwayat pribadi, hingga privasi data yang terjaga dalam
              satu platform.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {landingFeatures.map((feature) => (
              <Card key={feature.title} className="h-full p-6">
                <div className="rounded-2xl bg-brand-soft p-3 text-brand">
                  <feature.icon className="size-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-950 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="cara-kerja" className="py-20">
        <div className="container-shell grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-brand-deep">
              Cara Kerja Sistem
            </span>
            <h2 className="text-3xl font-semibold text-slate-950 dark:text-white sm:text-4xl">
              Cara kerja yang sederhana, nyaman, dan mudah dipahami oleh setiap pengguna.
            </h2>
            <p className="text-base leading-8 text-slate-600 dark:text-slate-300">
              Anda cukup menjawab pertanyaan satu per satu. Setelah itu, sistem
              mengolah jawaban menjadi hasil screening awal yang jelas, terarah,
              dan mudah dijadikan bahan refleksi atau konsultasi lanjutan.
            </p>

            <div className="space-y-4 rounded-[28px] bg-slate-50/80 p-6 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <MessageSquareHeart className="size-5 text-brand" />
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Pertanyaan dibuat bertahap agar proses screening terasa lebih ringan.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <BrainCircuit className="size-5 text-brand" />
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Jawaban diolah untuk membaca pola tidur, stres, aktivitas, dan suasana hati.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-5 text-brand" />
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Hasil diberikan dengan penjelasan ringkas dan disclaimer profesional.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            {landingSteps.map((step) => (
              <Card key={step.step} className="flex gap-5 p-6">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-accent text-lg font-semibold text-white">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-950 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {step.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="keunggulan" className="py-20">
        <div className="container-shell grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Card className="space-y-6 bg-gradient-to-br from-brand-soft via-white to-accent-soft dark:from-brand-soft dark:via-slate-950/35 dark:to-accent-soft">
            <span className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-deep shadow-sm dark:bg-slate-950/60">
              Kenapa PsyScreening
            </span>
            <h2 className="text-3xl font-semibold text-slate-950 dark:text-white">
              Pahami kondisi lebih awal dengan lebih tenang.
            </h2>
            <p className="text-base leading-8 text-slate-600 dark:text-slate-300">
              Ketika beban pikiran mulai terasa berat, langkah kecil untuk
              memeriksa kondisi diri bisa sangat berarti. PsyScreening hadir
              sebagai ruang awal yang aman dan mudah dipahami sebelum Anda
              mengambil langkah bantuan berikutnya.
            </p>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            {landingBenefits.map((benefit) => (
              <Card key={benefit} className="flex items-start gap-4 p-5">
                <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
                  <CheckCircle2 className="size-5" />
                </div>
                <p className="text-sm leading-7 text-slate-700 dark:text-slate-200">
                  {benefit}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-shell">
          <div className="mb-10 space-y-3">
            <span className="inline-flex rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-brand-deep">
              Testimoni
            </span>
            <h2 className="text-3xl font-semibold text-slate-950 dark:text-white">
              Testimoni Pengguna PsyScreening
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="h-full p-6">
                <Sparkles className="size-6 text-accent" />
                <p className="mt-6 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  "{testimonial.quote}"
                </p>
                <div className="mt-6">
                  <p className="font-semibold text-slate-950 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {testimonial.role}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20">
        <div className="container-shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-4">
            <span className="inline-flex rounded-full bg-accent-soft px-4 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              FAQ
            </span>
            <h2 className="text-3xl font-semibold text-slate-950 dark:text-white">
              Pertanyaan penting sebelum Anda memulai screening.
            </h2>
            <p className="text-base leading-8 text-slate-600 dark:text-slate-300">
              Kami merangkum pertanyaan yang paling penting agar Anda memahami
              cara kerja, batasan, dan keamanan penggunaan PsyScreening sejak awal.
            </p>
          </div>

          <div className="grid gap-4">
            {faqs.map((faq) => (
              <Card key={faq.question} className="p-6">
                <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                  {faq.question}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-shell">
          <div className="glass overflow-hidden p-8 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="space-y-4">
                <span className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-brand-deep shadow-sm dark:bg-white/10 dark:text-white">
                  Langkah Awal yang Aman
                </span>
                <h2 className="text-3xl font-semibold text-slate-950 dark:text-white sm:text-4xl">
                  Mulai screening awal kesehatan mental dengan alur yang tenang dan mudah dipahami.
                </h2>
                <p className="text-base leading-8 text-slate-600 dark:text-slate-300">
                  PsyScreening membantu Anda mengenali kondisi awal melalui
                  pertanyaan terarah dan hasil screening yang jelas serta profesional.
                </p>
                <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-700 dark:bg-white/5 dark:text-slate-200">
                  {MEDICAL_DISCLAIMER}
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto lg:w-full">
                    Mulai Screening
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto lg:w-full">
                    Login Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
