import { useEffect, useMemo, useState } from "react";
import { screeningService } from "@/services/screeningService";

export function useScreeningChat() {
  const [bootstrapping, setBootstrapping] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [screeningId, setScreeningId] = useState(null);
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [messages, setMessages] = useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function start() {
      try {
        const response = await screeningService.start();
        if (!mounted) return;

        setScreeningId(response.screening.id);
        setSession(response.session);
        setQuestions(response.questions);
        setCurrentQuestion(response.currentQuestion);
        setMessages(response.messages);
        setAnswers(response.answers);
        setError("");
      } catch (startError) {
        if (!mounted) return;
        setError(startError.message || "Gagal memulai screening.");
      } finally {
        if (mounted) {
          setBootstrapping(false);
        }
      }
    }

    start();

    return () => {
      mounted = false;
    };
  }, []);

  const progress = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round((answers.length / questions.length) * 100);
  }, [answers.length, questions.length]);

  return {
    bootstrapping,
    submitting,
    error,
    screeningId,
    session,
    questions,
    currentQuestion,
    messages,
    answers,
    progress,
    isComplete: Boolean(screeningId) && !currentQuestion && answers.length > 0,
    async submitAnswer(value) {
      const response = await screeningService.answer({
        screeningId,
        questionId: currentQuestion.id,
        value: currentQuestion.inputType === "number" ? Number(value) : value,
      });

      setCurrentQuestion(response.currentQuestion);
      setMessages(response.messages);
      setAnswers(response.answers);
    },
    async submitScreening() {
      setSubmitting(true);
      try {
        return await screeningService.submit({ screeningId });
      } finally {
        setSubmitting(false);
      }
    },
  };
}
