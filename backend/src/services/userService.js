import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";
import {
  buildSummaryFromAnswers,
  serializeProfile,
  serializeScreening,
  serializeUser,
} from "../utils/serializers.js";

async function getQuestionsMap() {
  const questions = await prisma.screeningQuestion.findMany();
  return new Map(questions.map((question) => [question.id, question]));
}

export async function getUserProfile(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user) {
    throw new AppError("User tidak ditemukan.", 404);
  }

  return {
    user: serializeUser(user),
    profile: serializeProfile(user.profile),
  };
}

export async function updateUserProfile(userId, payload) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("User tidak ditemukan.", 404);
  }

  const updated = await prisma.$transaction(async (tx) => {
    const nextUser = await tx.user.update({
      where: { id: userId },
      data: {
        name: payload.name.trim(),
      },
    });

    const profile = await tx.profile.upsert({
      where: { userId },
      create: {
        userId,
        phone: payload.phone ?? "",
        occupation: payload.occupation ?? "",
        city: payload.city ?? "",
        birthDate: payload.birthDate ?? "",
        gender: payload.gender ?? "",
        bio: payload.bio ?? "",
        emergencyContact: payload.emergencyContact ?? "",
      },
      update: {
        phone: payload.phone ?? "",
        occupation: payload.occupation ?? "",
        city: payload.city ?? "",
        birthDate: payload.birthDate ?? "",
        gender: payload.gender ?? "",
        bio: payload.bio ?? "",
        emergencyContact: payload.emergencyContact ?? "",
      },
    });

    return { user: nextUser, profile };
  });

  return {
    user: serializeUser(updated.user),
    profile: serializeProfile(updated.profile),
  };
}

export async function getUserHistory(userId) {
  const questionsMap = await getQuestionsMap();
  const screenings = await prisma.screening.findMany({
    where: {
      userId,
      status: "completed",
    },
    include: {
      answers: true,
      result: true,
      chatSession: true,
    },
    orderBy: {
      completedAt: "desc",
    },
  });

  return {
    items: screenings.map((screening) => ({
      ...serializeScreening(screening, questionsMap),
      summary: buildSummaryFromAnswers(screening.answers, questionsMap),
    })),
  };
}
