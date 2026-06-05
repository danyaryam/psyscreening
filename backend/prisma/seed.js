import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { SCREENING_QUESTION_SEED } from "../src/utils/constants.js";

const prisma = new PrismaClient();

const DEFAULT_ADMIN_EMAIL = "adminganteng@gmail.com";
const DEFAULT_ADMIN_PASSWORD = "Adminganjil13579";
const normalizeEmail = (email) => email.trim().toLowerCase();

const getAdminCredentials = () => {
  const email = normalizeEmail(process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL);
  const password = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;

  if (!password.trim()) {
    throw new Error("ADMIN_PASSWORD tidak boleh kosong.");
  }

  return { email, password };
};

const upsertAdmin = async () => {
  const { email, password } = getAdminCredentials();
  const passwordHash = await bcrypt.hash(password, 10);

  return prisma.user.upsert({
    where: { email },
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
          update: {
            occupation: "Administrator PsyScreening",
            city: "Indonesia",
            bio: "Akun admin utama untuk mengelola platform PsyScreening.",
          },
          create: {
            occupation: "Administrator PsyScreening",
            city: "Indonesia",
            bio: "Akun admin utama untuk mengelola platform PsyScreening.",
          },
        },
      },
    },
    create: {
      name: "Admin PsyScreening",
      email,
      passwordHash,
      role: "admin",
      emailVerified: true,
      authProvider: "local",
      profile: {
        create: {
          occupation: "Administrator PsyScreening",
          city: "Indonesia",
          bio: "Akun admin utama untuk mengelola platform PsyScreening.",
        },
      },
    },
  });
};

const cleanDevelopmentRuntimeData = async (adminEmail) => {
  if (process.env.NODE_ENV === "production") {
    return {
      users: 0,
      screenings: 0,
      chatSessions: 0,
      chatMessages: 0,
      answers: 0,
      results: 0,
      logs: 0,
    };
  }

  const chatMessages = await prisma.chatMessage.deleteMany();
  const chatSessions = await prisma.chatSession.deleteMany();
  const results = await prisma.screeningResult.deleteMany();
  const answers = await prisma.screeningAnswer.deleteMany();
  const screenings = await prisma.screening.deleteMany();
  const logs = await prisma.adminLog.deleteMany();
  const users = await prisma.user.deleteMany({
    where: {
      email: {
        not: adminEmail,
      },
    },
  });

  return {
    users: users.count,
    screenings: screenings.count,
    chatSessions: chatSessions.count,
    chatMessages: chatMessages.count,
    answers: answers.count,
    results: results.count,
    logs: logs.count,
  };
};

const upsertScreeningQuestions = async () => {
  let count = 0;

  for (const question of SCREENING_QUESTION_SEED) {
    await prisma.screeningQuestion.upsert({
      where: { key: question.key },
      update: {
        title: question.title,
        helperText: question.helperText ?? null,
        inputType: question.inputType,
        placeholder: question.placeholder ?? null,
        min: question.min ?? null,
        max: question.max ?? null,
        step: question.step ?? null,
        required: question.required ?? true,
        order: question.order,
        isActive: question.isActive ?? true,
        options: question.options ?? null,
      },
      create: {
        id: question.id,
        key: question.key,
        title: question.title,
        helperText: question.helperText ?? null,
        inputType: question.inputType,
        placeholder: question.placeholder ?? null,
        min: question.min ?? null,
        max: question.max ?? null,
        step: question.step ?? null,
        required: question.required ?? true,
        order: question.order,
        isActive: question.isActive ?? true,
        options: question.options ?? null,
      },
    });

    count += 1;
  }

  return count;
};

async function main() {
  const { email: adminEmail } = getAdminCredentials();
  const cleanup = await cleanDevelopmentRuntimeData(adminEmail);
  const admin = await upsertAdmin();
  const questionCount = await upsertScreeningQuestions();

  const [totalUsers, totalScreenings, totalChatSessions, totalResults] =
    await Promise.all([
      prisma.user.count(),
      prisma.screening.count(),
      prisma.chatSession.count(),
      prisma.screeningResult.count(),
    ]);

  console.log("Seed PsyScreening selesai.");
  console.log(`Admin utama: ${admin.email}`);
  console.log(`Pertanyaan screening aktif/default dipastikan: ${questionCount}`);
  console.log(
    `Data development dibersihkan: ${cleanup.users} user, ${cleanup.screenings} screening, ${cleanup.chatSessions} chat session, ${cleanup.chatMessages} chat message, ${cleanup.answers} answer, ${cleanup.results} result, ${cleanup.logs} admin log.`,
  );
  console.log(
    `Ringkasan database: ${totalUsers} user, ${totalScreenings} screening, ${totalChatSessions} chat session, ${totalResults} result.`,
  );
  console.log("Seed ini tidak membuat user dummy, chat dummy, atau hasil dummy.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
