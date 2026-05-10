import { AlertTriangle, BrainCircuit, Sparkles } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AnswerSummary } from "@/components/screening/AnswerSummary";
import { ChatMessage } from "@/components/screening/ChatMessage";
import { QuestionRenderer } from "@/components/screening/QuestionRenderer";
import { ScreeningProgress } from "@/components/screening/ScreeningProgress";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { PageHeader } from "@/components/ui/PageHeader";
import { useScreeningChat } from "@/hooks/useScreeningChat";
import { MEDICAL_DISCLAIMER } from "@/utils/constants";

export function ScreeningChatPage() {
  const navigate = useNavigate();
  const [answering, setAnswering] = useState(false);
  const {
    bootstrapping,
    submitting,
    error,
    currentQuestion,
    messages,
    answers,
    questions,
    progress,
    isComplete,
    submitAnswer,
    submitScreening,
  } = useScreeningChat();

  if (bootstrapping) {
    return <LoadingScreen title="Menyiapkan screening chat..." />;
  }

  if (error) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Screening tidak dapat dimulai"
        description={error}
        actionLabel="Kembali ke Dashboard"
        onAction={() => navigate("/app/dashboard")}
      />
    );
  }

  const handleAnswer = async (value) => {
    setAnswering(true);
    try {
      await submitAnswer(value);
    } catch (error) {
      toast.error(error.message || "Gagal menyimpan jawaban.");
    } finally {
      setAnswering(false);
    }
  };

  const handleSubmitScreening = async () => {
    try {
      const response = await submitScreening();
      toast.success("Hasil screening berhasil diproses.");
      navigate(`/app/results/${response.screeningId}`);
    } catch (error) {
      toast.error(error.message || "Gagal memproses screening.");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Guided Screening Chat"
        title="Mulai screening kondisi mental Anda"
        description="Jawab pertanyaan satu per satu. Sistem akan mengumpulkan pola tidur, stres, aktivitas, dan kondisi psikologis dasar untuk screening awal."
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <ScreeningProgress
            current={Math.min(answers.length + 1, questions.length)}
            total={questions.length}
            progress={progress}
          />

          <Card className="overflow-hidden p-0">
            <div className="border-b border-slate-200 px-6 py-5 dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-brand-soft p-3 text-brand">
                  <BrainCircuit className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                    Conversation Workspace
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Rule-based flow yang siap dihubungkan ke backend ML.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 bg-slate-50/80 px-4 py-6 dark:bg-slate-950/30 sm:px-6">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>

            <div className="border-t border-slate-200 px-6 py-6 dark:border-white/10">
              {isComplete ? (
                <AnswerSummary
                  answers={answers}
                  onSubmit={handleSubmitScreening}
                  loading={submitting}
                />
              ) : (
                <QuestionRenderer
                  question={currentQuestion}
                  onSubmit={handleAnswer}
                  disabled={answering}
                />
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-accent-soft p-3 text-accent">
                <Sparkles className="size-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-950 dark:text-white">
                  Tips menjawab
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Jawaban yang jujur akan memberi hasil screening yang lebih relevan.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
              <p>Fokus pada kondisi 7 hari terakhir agar pola lebih konsisten.</p>
              <p>Tidak perlu menulis panjang jika memang tidak diperlukan.</p>
              <p>Gunakan hasil screening sebagai sinyal awal, bukan diagnosis akhir.</p>
            </div>
          </Card>

          <Card className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-100 p-3 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
                <AlertTriangle className="size-5" />
              </div>
              <h3 className="text-xl font-semibold text-slate-950 dark:text-white">
                Disclaimer
              </h3>
            </div>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
              {MEDICAL_DISCLAIMER}
            </p>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-950 dark:text-white">
              Jawaban yang sudah masuk
            </h3>
            {answers.length ? (
              <div className="space-y-3">
                {answers.map((item) => (
                  <div
                    key={item.questionId}
                    className="rounded-2xl border border-slate-200 px-4 py-3 dark:border-white/10"
                  >
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                Jawaban akan muncul di sini seiring Anda melanjutkan percakapan.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
