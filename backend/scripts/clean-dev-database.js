import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { SCREENING_QUESTION_SEED } from "../src/utils/constants.js";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "adminganteng@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Adminganjil13579";

function assertDevelopmentEnvironment() {
  if (process.env.NODE_ENV?.toLowerCase() === "production") {
    throw new Error("Cleanup database diblokir karena NODE_ENV=production.");
  }
}

async function ensureScreeningQuestionsExist() {
  const questionCount = await prisma.screeningQuestion.count();

  if (questionCount > 0) {
    return { created: 0, existing: questionCount };
  }

  await prisma.screeningQuestion.createMany({
    data: SCREENING_QUESTION_SEED.map((question) => ({
      ...question,
      options: question.options ?? null,
    })),
  });

  return { created: SCREENING_QUESTION_SEED.length, existing: 0 };
}

async function cleanDatabase() {
  assertDevelopmentEnvironment();

  const normalizedAdminEmail = ADMIN_EMAIL.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const before = {
    users: await prisma.user.count(),
    screenings: await prisma.screening.count(),
    answers: await prisma.screeningAnswer.count(),
    results: await prisma.screeningResult.count(),
    sessions: await prisma.chatSession.count(),
    messages: await prisma.chatMessage.count(),
    questions: await prisma.screeningQuestion.count(),
    logs: await prisma.adminLog.count(),
  };

  await prisma.$transaction(async (tx) => {
    await tx.chatMessage.deleteMany();
    await tx.chatSession.deleteMany();
    await tx.screeningResult.deleteMany();
    await tx.screeningAnswer.deleteMany();
    await tx.screening.deleteMany();
    await tx.adminLog.deleteMany();
    await tx.profile.deleteMany();
    await tx.user.deleteMany({
      where: {
        email: {
          not: normalizedAdminEmail,
        },
      },
    });

    await tx.user.upsert({
      where: { email: normalizedAdminEmail },
      update: {
        name: "Admin PsyScreening",
        passwordHash,
        role: "admin",
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        googleId: null,
        authProvider: "local",
        avatar: null,
        profile: {
          upsert: {
            create: {
              occupation: "Administrator",
              city: "Indonesia",
              bio: "Admin utama PsyScreening.",
            },
            update: {
              occupation: "Administrator",
              city: "Indonesia",
              bio: "Admin utama PsyScreening.",
            },
          },
        },
      },
      create: {
        name: "Admin PsyScreening",
        email: normalizedAdminEmail,
        passwordHash,
        role: "admin",
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        authProvider: "local",
        profile: {
          create: {
            occupation: "Administrator",
            city: "Indonesia",
            bio: "Admin utama PsyScreening.",
          },
        },
      },
    });
  });

  const questions = await ensureScreeningQuestionsExist();

  const after = {
    users: await prisma.user.count(),
    admins: await prisma.user.count({ where: { role: "admin" } }),
    regularUsers: await prisma.user.count({ where: { role: "user" } }),
    screenings: await prisma.screening.count(),
    answers: await prisma.screeningAnswer.count(),
    results: await prisma.screeningResult.count(),
    sessions: await prisma.chatSession.count(),
    messages: await prisma.chatMessage.count(),
    questions: await prisma.screeningQuestion.count(),
    logs: await prisma.adminLog.count(),
  };

  console.log("Cleanup database development selesai.");
  console.table({ before, after });
  console.log(`Admin utama: ${normalizedAdminEmail}`);
  console.log(
    questions.created > 0
      ? `Pertanyaan screening kosong, ${questions.created} pertanyaan default ditambahkan.`
      : `Pertanyaan screening dipertahankan: ${questions.existing} data.`,
  );
}

cleanDatabase()
  .catch((error) => {
    console.error("Cleanup database development gagal.");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
