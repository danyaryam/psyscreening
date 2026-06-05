import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";
import {
  buildSummaryFromAnswers,
  serializeMessage,
  serializeQuestion,
  serializeResult,
  serializeScreening,
  serializeSession,
  serializeUser,
} from "../utils/serializers.js";
import {
  formatAnswerDisplay,
  getCurrentQuestion,
  mapAnswersToFeatures,
  normalizeAnswerValue,
} from "../utils/screeningFlow.js";
import { predictScreening } from "./mlService.js";

async function getActiveQuestions(tx = prisma) {
  return tx.screeningQuestion.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
}

async function getQuestionsMap(tx = prisma) {
  const questions = await tx.screeningQuestion.findMany();
  return new Map(questions.map((question) => [question.id, question]));
}

function getWelcomeMessages(userName, firstQuestion) {
  const firstName = userName.split(" ")[0];

  return [
    {
      sender: "system",
      content: `Halo ${firstName}, saya akan memandu screening singkat untuk memahami pola tidur, stres, aktivitas, dan suasana hati Anda.`,
    },
    {
      sender: "system",
      content:
        "Jawab sejujur mungkin ya. Hasil ini hanya untuk screening awal, bukan diagnosis profesional.",
    },
    {
      sender: "system",
      content: firstQuestion.title,
    },
  ];
}

function serializeStartPayload(screening, session, questions) {
  const questionsMap = new Map(questions.map((question) => [question.id, question]));
  const currentQuestion = getCurrentQuestion(questions, screening.currentQuestionIndex);

  return {
    screening: serializeScreening(screening, questionsMap),
    session: serializeSession(session),
    questions: questions.map(serializeQuestion),
    currentQuestion: serializeQuestion(currentQuestion),
    messages: session.messages.map(serializeMessage),
    answers: buildSummaryFromAnswers(screening.answers, questionsMap),
  };
}

export async function startScreening(user) {
  const questions = await getActiveQuestions();

  if (!questions.length) {
    throw new AppError("Belum ada pertanyaan screening yang aktif.", 400);
  }

  const active = await prisma.screening.findFirst({
    where: {
      userId: user.id,
      status: "in_progress",
    },
    include: {
      answers: true,
      result: true,
      chatSession: {
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  if (active && active.chatSession) {
    return serializeStartPayload(active, active.chatSession, questions);
  }

  const created = await prisma.$transaction(async (tx) => {
    const screening = await tx.screening.create({
      data: {
        userId: user.id,
        status: "in_progress",
        currentQuestionIndex: 0,
      },
    });

    const session = await tx.chatSession.create({
      data: {
        userId: user.id,
        screeningId: screening.id,
        status: "active",
      },
    });

    await tx.chatMessage.createMany({
      data: getWelcomeMessages(user.name, questions[0]).map((message) => ({
        ...message,
        sessionId: session.id,
      })),
    });

    const freshScreening = await tx.screening.findUniqueOrThrow({
      where: { id: screening.id },
      include: {
        answers: true,
        result: true,
        chatSession: {
          include: {
            messages: {
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
    });

    return freshScreening;
  });

  return serializeStartPayload(created, created.chatSession, questions);
}

export async function answerScreening(userId, payload) {
  const questions = await getActiveQuestions();
  const questionsMap = new Map(questions.map((question) => [question.id, question]));

  const screening = await prisma.screening.findUnique({
    where: { id: payload.screeningId },
    include: {
      answers: true,
      result: true,
      chatSession: {
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  if (!screening || screening.userId !== userId) {
    throw new AppError("Screening aktif tidak ditemukan.", 404);
  }

  if (!screening.chatSession) {
    throw new AppError("Chat session screening tidak ditemukan.", 500);
  }

  const currentQuestion = getCurrentQuestion(questions, screening.currentQuestionIndex);

  if (!currentQuestion || currentQuestion.id !== payload.questionId) {
    throw new AppError("Pertanyaan saat ini tidak sesuai dengan alur screening.", 400);
  }

  const value = normalizeAnswerValue(currentQuestion, payload.value);
  const displayValue = formatAnswerDisplay(currentQuestion, value);

  const updated = await prisma.$transaction(async (tx) => {
    await tx.screeningAnswer.upsert({
      where: {
        screeningId_questionId: {
          screeningId: screening.id,
          questionId: currentQuestion.id,
        },
      },
      create: {
        screeningId: screening.id,
        questionId: currentQuestion.id,
        questionKey: currentQuestion.key,
        value,
        displayValue,
      },
      update: {
        value,
        displayValue,
      },
    });

    await tx.chatMessage.create({
      data: {
        sessionId: screening.chatSession.id,
        sender: "user",
        content: displayValue,
      },
    });

    const nextQuestionIndex = screening.currentQuestionIndex + 1;
    const nextQuestion = getCurrentQuestion(questions, nextQuestionIndex);

    await tx.screening.update({
      where: { id: screening.id },
      data: {
        currentQuestionIndex: nextQuestionIndex,
      },
    });

    await tx.chatMessage.create({
      data: {
        sessionId: screening.chatSession.id,
        sender: "system",
        content: nextQuestion
          ? nextQuestion.title
          : "Semua jawaban telah terkumpul. Silakan tinjau ringkasan sebelum mengirim ke model screening.",
      },
    });

    return tx.screening.findUniqueOrThrow({
      where: { id: screening.id },
      include: {
        answers: true,
        result: true,
        chatSession: {
          include: {
            messages: {
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
    });
  });

  return {
    screening: serializeScreening(updated, questionsMap),
    currentQuestion: serializeQuestion(
      getCurrentQuestion(questions, updated.currentQuestionIndex),
    ),
    messages: updated.chatSession.messages.map(serializeMessage),
    answers: buildSummaryFromAnswers(updated.answers, questionsMap),
    isComplete: !getCurrentQuestion(questions, updated.currentQuestionIndex),
  };
}

export async function submitScreening(userId, payload) {
  const questionsMap = await getQuestionsMap();
  const activeQuestions = await getActiveQuestions();
  const screening = await prisma.screening.findUnique({
    where: { id: payload.screeningId },
    include: {
      answers: true,
      result: true,
      chatSession: true,
      user: {
        include: {
          profile: true,
        },
      },
    },
  });

  if (!screening || screening.userId !== userId) {
    throw new AppError("Data screening tidak ditemukan.", 404);
  }

  if (!screening.chatSession) {
    throw new AppError("Chat session screening tidak ditemukan.", 500);
  }

  if (
    screening.status === "in_progress" &&
    screening.currentQuestionIndex < activeQuestions.length
  ) {
    throw new AppError(
      "Screening belum selesai. Jawab seluruh pertanyaan sebelum submit.",
      400,
    );
  }

  if (screening.result && screening.status === "completed") {
    return {
      screeningId: screening.id,
      resultId: screening.result.id,
      result: serializeResult(screening.result),
      summary: buildSummaryFromAnswers(screening.answers, questionsMap),
    };
  }

  const features = mapAnswersToFeatures(screening.answers);
  const prediction = await predictScreening(features, {
    profile: screening.user.profile,
    createdAt: screening.startedAt,
  });

  const completed = await prisma.$transaction(async (tx) => {
    const result = await tx.screeningResult.upsert({
      where: { screeningId: screening.id },
      create: {
        screeningId: screening.id,
        riskLevel: prediction.riskLevel,
        score: prediction.score,
        modelUsed: prediction.modelUsed,
        insights: prediction.insights,
        recommendations: prediction.recommendations,
        disclaimer: prediction.disclaimer,
        aiProvider: prediction.aiProvider,
        aiSeverity: prediction.aiSeverity,
        aiConfidence: prediction.aiConfidence,
        aiRawResponse: prediction.aiRawResponse ?? undefined,
      },
      update: {
        riskLevel: prediction.riskLevel,
        score: prediction.score,
        modelUsed: prediction.modelUsed,
        insights: prediction.insights,
        recommendations: prediction.recommendations,
        disclaimer: prediction.disclaimer,
        aiProvider: prediction.aiProvider,
        aiSeverity: prediction.aiSeverity,
        aiConfidence: prediction.aiConfidence,
        aiRawResponse: prediction.aiRawResponse ?? undefined,
      },
    });

    await tx.screening.update({
      where: { id: screening.id },
      data: {
        status: "completed",
        completedAt: new Date(),
      },
    });

    await tx.chatSession.update({
      where: { id: screening.chatSession.id },
      data: {
        status: "completed",
        completedAt: new Date(),
      },
    });

    await tx.chatMessage.create({
      data: {
        sessionId: screening.chatSession.id,
        sender: "system",
        content: `Analisis selesai. Level risiko Anda saat ini: ${prediction.riskLevel.toUpperCase()} dengan skor ${prediction.score}/100.`,
      },
    });

    return result;
  });

  return {
    screeningId: screening.id,
    resultId: completed.id,
    result: serializeResult(completed),
    summary: buildSummaryFromAnswers(screening.answers, questionsMap),
  };
}

export async function getUserScreenings(userId) {
  const questionsMap = await getQuestionsMap();
  const screenings = await prisma.screening.findMany({
    where: { userId, status: "completed" },
    include: {
      answers: true,
      result: true,
      chatSession: true,
    },
    orderBy: { completedAt: "desc" },
  });

  return {
    items: screenings.map((screening) => serializeScreening(screening, questionsMap)),
  };
}

export async function getScreeningById(currentUser, screeningId) {
  const questionsMap = await getQuestionsMap();
  const screening = await prisma.screening.findUnique({
    where: { id: screeningId },
    include: {
      answers: true,
      result: true,
      user: true,
      chatSession: {
        include: {
          messages: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  if (!screening) {
    throw new AppError("Data screening tidak ditemukan.", 404);
  }

  if (currentUser.role !== "admin" && screening.userId !== currentUser.id) {
    throw new AppError("Anda tidak memiliki akses ke hasil screening ini.", 403);
  }

  return {
    item: {
      ...serializeScreening(screening, questionsMap),
      user: serializeUser(screening.user),
      messages: screening.chatSession?.messages.map(serializeMessage) ?? [],
    },
  };
}
