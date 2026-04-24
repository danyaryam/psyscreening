import { randomUUID } from "node:crypto";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";
import {
  buildSummaryFromAnswers,
  serializeAdminLog,
  serializeProfile,
  serializeQuestion,
  serializeResult,
  serializeScreening,
  serializeUser,
} from "../utils/serializers.js";
import { createAdminLog } from "./adminLogService.js";

async function getQuestionsMap() {
  const questions = await prisma.screeningQuestion.findMany();
  return new Map(questions.map((question) => [question.id, question]));
}

export async function getAdminUsers(adminId) {
  await createAdminLog(adminId, "VIEW_USERS", "users", "Admin membuka daftar users.");

  const users = await prisma.user.findMany({
    where: { role: "user" },
    include: {
      profile: true,
      screenings: {
        where: { status: "completed" },
        include: { result: true },
        orderBy: { completedAt: "desc" },
        take: 1,
      },
      _count: {
        select: { screenings: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return {
    items: users.map((user) => {
      const latest = user.screenings[0];
      return {
        ...serializeUser(user),
        profile: serializeProfile(user.profile),
        screeningsCount: user._count.screenings,
        latestRiskLevel: latest?.result?.riskLevel ?? null,
        latestScore: latest?.result?.score ?? null,
        latestScreeningAt: latest?.completedAt?.toISOString() ?? null,
      };
    }),
  };
}

export async function getAdminUserById(userId) {
  const questionsMap = await getQuestionsMap();
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      role: "user",
    },
    include: {
      profile: true,
      screenings: {
        include: {
          answers: true,
          result: true,
          chatSession: true,
        },
        orderBy: { startedAt: "desc" },
      },
    },
  });

  if (!user) {
    throw new AppError("User tidak ditemukan.", 404);
  }

  return {
    item: {
      ...serializeUser(user),
      profile: serializeProfile(user.profile),
      screenings: user.screenings.map((screening) =>
        serializeScreening(screening, questionsMap),
      ),
    },
  };
}

export async function getAdminScreenings(adminId) {
  await createAdminLog(
    adminId,
    "VIEW_SCREENINGS",
    "screenings",
    "Admin membuka data screening.",
  );

  const questionsMap = await getQuestionsMap();
  const screenings = await prisma.screening.findMany({
    where: { status: "completed" },
    include: {
      user: true,
      answers: true,
      result: true,
      chatSession: true,
    },
    orderBy: { completedAt: "desc" },
  });

  return {
    items: screenings.map((screening) => ({
      ...serializeScreening(screening, questionsMap),
      user: serializeUser(screening.user),
    })),
  };
}

export async function getAdminStats(adminId) {
  await createAdminLog(
    adminId,
    "VIEW_STATS",
    "screenings",
    "Admin membuka statistik hasil screening.",
  );

  const [totalUsers, totalScreenings, averageScoreAggregate, riskGroup, recentLogs] =
    await Promise.all([
      prisma.user.count({ where: { role: "user" } }),
      prisma.screening.count({ where: { status: "completed" } }),
      prisma.screeningResult.aggregate({ _avg: { score: true } }),
      prisma.screeningResult.groupBy({
        by: ["riskLevel"],
        _count: { _all: true },
      }),
      prisma.adminLog.findMany({
        include: { admin: true },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
    ]);

  const riskCounts = {
    rendah: 0,
    sedang: 0,
    tinggi: 0,
  };

  for (const item of riskGroup) {
    riskCounts[item.riskLevel] = item._count._all;
  }

  const activeQuestions = await prisma.screeningQuestion.count({
    where: { isActive: true },
  });

  return {
    summary: {
      totalUsers,
      totalScreenings,
      averageScore: Math.round(averageScoreAggregate._avg.score ?? 0),
      activeQuestions,
    },
    riskCounts,
    recentLogs: recentLogs.map(serializeAdminLog),
  };
}

export async function getAdminQuestions() {
  const questions = await prisma.screeningQuestion.findMany({
    orderBy: { order: "asc" },
  });

  return {
    items: questions.map(serializeQuestion),
  };
}

export async function createAdminQuestion(adminId, payload) {
  const question = await prisma.screeningQuestion.create({
    data: {
      id: `question_${randomUUID()}`,
      title: payload.title,
      key: payload.key,
      helperText: payload.helperText ?? "",
      inputType: payload.inputType,
      placeholder: payload.placeholder ?? "",
      min: payload.min ?? null,
      max: payload.max ?? null,
      step: payload.step ?? null,
      required: payload.required,
      order: payload.order,
      options: payload.options ?? [],
      isActive: true,
    },
  });

  await createAdminLog(
    adminId,
    "CREATE_QUESTION",
    "screening_questions",
    `Menambah pertanyaan "${payload.title}".`,
  );

  return { item: serializeQuestion(question) };
}

export async function updateAdminQuestion(adminId, questionId, payload) {
  const exists = await prisma.screeningQuestion.findUnique({
    where: { id: questionId },
  });

  if (!exists) {
    throw new AppError("Pertanyaan tidak ditemukan.", 404);
  }

  const question = await prisma.screeningQuestion.update({
    where: { id: questionId },
    data: {
      title: payload.title,
      key: payload.key,
      helperText: payload.helperText ?? "",
      inputType: payload.inputType,
      placeholder: payload.placeholder ?? "",
      min: payload.min ?? null,
      max: payload.max ?? null,
      step: payload.step ?? null,
      required: payload.required,
      order: payload.order,
      options: payload.options ?? [],
    },
  });

  await createAdminLog(
    adminId,
    "UPDATE_QUESTION",
    "screening_questions",
    `Mengubah pertanyaan "${question.title}".`,
  );

  return { item: serializeQuestion(question) };
}

export async function deleteAdminQuestion(adminId, questionId) {
  const question = await prisma.screeningQuestion.findUnique({
    where: { id: questionId },
  });

  if (!question) {
    throw new AppError("Pertanyaan tidak ditemukan.", 404);
  }

  await prisma.screeningQuestion.delete({
    where: { id: questionId },
  });

  await createAdminLog(
    adminId,
    "DELETE_QUESTION",
    "screening_questions",
    `Menghapus pertanyaan "${question.title}".`,
  );

  return { success: true };
}
