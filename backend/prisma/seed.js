import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import {
  MEDICAL_DISCLAIMER,
  SCREENING_QUESTION_SEED,
} from "../src/utils/constants.js";

const prisma = new PrismaClient();

function nowOffset(daysAgo = 0, hoursAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  return date;
}

async function main() {
  await prisma.chatMessage.deleteMany();
  await prisma.chatSession.deleteMany();
  await prisma.screeningResult.deleteMany();
  await prisma.screeningAnswer.deleteMany();
  await prisma.screening.deleteMany();
  await prisma.adminLog.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.screeningQuestion.deleteMany();
  await prisma.user.deleteMany();

  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);
  const userPasswordHash = await bcrypt.hash("User123!", 10);

  await prisma.user.create({
    data: {
      id: "user_admin_1",
      name: "Ayu Admin",
      email: "admin@psyscreening.id",
      passwordHash: adminPasswordHash,
      role: "admin",
      createdAt: nowOffset(30),
      updatedAt: new Date(),
      profile: {
        create: {
          id: "profile_admin_1",
          phone: "081200000001",
          occupation: "System Administrator",
          city: "Jakarta",
          birthDate: "1995-03-12",
          gender: "Perempuan",
          bio: "Mengelola operasional platform screening dan data admin.",
          emergencyContact: "Tim Ops - 081122223333",
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: "user_dina_1",
      name: "Dina Maheswari",
      email: "dina@psyscreening.id",
      passwordHash: userPasswordHash,
      role: "user",
      createdAt: nowOffset(18),
      updatedAt: new Date(),
      profile: {
        create: {
          id: "profile_user_1",
          phone: "081300000002",
          occupation: "Mahasiswa",
          city: "Bandung",
          birthDate: "2002-06-21",
          gender: "Perempuan",
          bio: "Sedang mencoba menjaga pola tidur dan aktivitas harian tetap stabil.",
          emergencyContact: "Ibu - 081344445555",
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: "user_arya_1",
      name: "Arya Rahman",
      email: "arya@psyscreening.id",
      passwordHash: userPasswordHash,
      role: "user",
      createdAt: nowOffset(11),
      updatedAt: new Date(),
      profile: {
        create: {
          id: "profile_user_2",
          phone: "081300000003",
          occupation: "UI Designer",
          city: "Yogyakarta",
          birthDate: "1999-01-09",
          gender: "Laki-laki",
          bio: "Aktif mengikuti program wellness perusahaan.",
          emergencyContact: "Kakak - 081366667777",
        },
      },
    },
  });

  for (const question of SCREENING_QUESTION_SEED) {
    await prisma.screeningQuestion.create({
      data: {
        ...question,
        options: question.options ?? null,
      },
    });
  }

  await prisma.screening.create({
    data: {
      id: "screening_seed_1",
      userId: "user_dina_1",
      status: "completed",
      currentQuestionIndex: SCREENING_QUESTION_SEED.length,
      startedAt: nowOffset(2, 4),
      completedAt: nowOffset(2, 3),
      chatSession: {
        create: {
          id: "session_seed_1",
          userId: "user_dina_1",
          status: "completed",
          startedAt: nowOffset(2, 4),
          completedAt: nowOffset(2, 3),
          messages: {
            create: [
              {
                id: "msg_seed_1",
                sender: "system",
                content:
                  "Halo Dina, saya akan memandu screening singkat untuk memahami pola tidur, stres, aktivitas, dan suasana hati Anda.",
                createdAt: nowOffset(2, 4),
              },
              {
                id: "msg_seed_2",
                sender: "system",
                content:
                  "Jawab sejujur mungkin ya. Hasil ini hanya untuk screening awal, bukan diagnosis profesional.",
                createdAt: nowOffset(2, 4),
              },
            ],
          },
        },
      },
      answers: {
        create: [
          {
            id: "ans_seed_1",
            questionId: "q_sleep_hours",
            questionKey: "sleepHours",
            value: 6,
            displayValue: "6 jam",
            createdAt: nowOffset(2, 3),
          },
          {
            id: "ans_seed_2",
            questionId: "q_sleep_quality",
            questionKey: "sleepQuality",
            value: "cukup",
            displayValue: "Kadang terganggu",
            createdAt: nowOffset(2, 3),
          },
          {
            id: "ans_seed_3",
            questionId: "q_stress_level",
            questionKey: "stressLevel",
            value: 7,
            displayValue: "7/10",
            createdAt: nowOffset(2, 3),
          },
          {
            id: "ans_seed_4",
            questionId: "q_daily_activity",
            questionKey: "activityLevel",
            value: "sedang",
            displayValue: "Cukup aktif tetapi naik turun",
            createdAt: nowOffset(2, 3),
          },
          {
            id: "ans_seed_5",
            questionId: "q_mood",
            questionKey: "moodState",
            value: "berfluktuasi",
            displayValue: "Kadang mudah lelah / cemas",
            createdAt: nowOffset(2, 3),
          },
          {
            id: "ans_seed_6",
            questionId: "q_social_support",
            questionKey: "socialSupport",
            value: "cukup",
            displayValue: "Ada dukungan, tetapi terbatas",
            createdAt: nowOffset(2, 3),
          },
        ],
      },
      result: {
        create: {
          id: "result_seed_1",
          riskLevel: "sedang",
          score: 68,
          modelUsed: "Random Forest",
          insights: [
            "Pola tidur kurang stabil dan berada di bawah target ideal.",
            "Tingkat stres harian cenderung tinggi dalam beberapa hari terakhir.",
            "Aktivitas harian terlihat cukup aktif tetapi belum konsisten.",
          ],
          recommendations: [
            "Coba konsisten tidur dan bangun pada jam yang sama selama beberapa hari.",
            "Sisihkan jeda singkat untuk recovery mental ketika beban meningkat.",
            "Pertimbangkan berbicara dengan orang tepercaya bila stres mulai terasa berat.",
          ],
          disclaimer: MEDICAL_DISCLAIMER,
          createdAt: nowOffset(2, 3),
        },
      },
    },
  });

  await prisma.screening.create({
    data: {
      id: "screening_seed_2",
      userId: "user_arya_1",
      status: "completed",
      currentQuestionIndex: SCREENING_QUESTION_SEED.length,
      startedAt: nowOffset(5, 7),
      completedAt: nowOffset(5, 6),
      chatSession: {
        create: {
          id: "session_seed_2",
          userId: "user_arya_1",
          status: "completed",
          startedAt: nowOffset(5, 7),
          completedAt: nowOffset(5, 6),
          messages: {
            create: [
              {
                id: "msg_seed_3",
                sender: "system",
                content:
                  "Halo Arya, mari kita lakukan screening awal dengan beberapa pertanyaan terarah.",
                createdAt: nowOffset(5, 7),
              },
            ],
          },
        },
      },
      answers: {
        create: [
          {
            id: "ans_seed_7",
            questionId: "q_sleep_hours",
            questionKey: "sleepHours",
            value: 4.5,
            displayValue: "4.5 jam",
            createdAt: nowOffset(5, 6),
          },
          {
            id: "ans_seed_8",
            questionId: "q_sleep_quality",
            questionKey: "sleepQuality",
            value: "buruk",
            displayValue: "Sering terbangun / tidak nyenyak",
            createdAt: nowOffset(5, 6),
          },
          {
            id: "ans_seed_9",
            questionId: "q_stress_level",
            questionKey: "stressLevel",
            value: 9,
            displayValue: "9/10",
            createdAt: nowOffset(5, 6),
          },
          {
            id: "ans_seed_10",
            questionId: "q_daily_activity",
            questionKey: "activityLevel",
            value: "rendah",
            displayValue: "Cenderung menurun / sulit konsisten",
            createdAt: nowOffset(5, 6),
          },
          {
            id: "ans_seed_11",
            questionId: "q_mood",
            questionKey: "moodState",
            value: "menurun",
            displayValue: "Sering sedih, kosong, atau tertekan",
            createdAt: nowOffset(5, 6),
          },
          {
            id: "ans_seed_12",
            questionId: "q_social_support",
            questionKey: "socialSupport",
            value: "rendah",
            displayValue: "Saya merasa cukup sendirian",
            createdAt: nowOffset(5, 6),
          },
        ],
      },
      result: {
        create: {
          id: "result_seed_2",
          riskLevel: "tinggi",
          score: 84,
          modelUsed: "Decision Tree",
          insights: [
            "Jam tidur jauh dari pola ideal dan kualitas tidur kurang baik.",
            "Stres tinggi disertai penurunan aktivitas dan dukungan sosial yang rendah.",
            "Suasana hati menunjukkan indikasi penurunan yang perlu diperhatikan lebih lanjut.",
          ],
          recommendations: [
            "Prioritaskan istirahat dan kurangi aktivitas yang memperburuk kelelahan.",
            "Segera cari dukungan dari orang tepercaya, counselor, atau profesional kesehatan mental.",
            "Buat langkah harian yang sederhana dan realistis untuk memulihkan rutinitas.",
          ],
          disclaimer: MEDICAL_DISCLAIMER,
          createdAt: nowOffset(5, 6),
        },
      },
    },
  });

  await prisma.adminLog.createMany({
    data: [
      {
        id: "log_seed_1",
        adminId: "user_admin_1",
        action: "LOGIN",
        entity: "auth",
        description: "Admin login ke dashboard monitoring.",
        createdAt: nowOffset(0, 2),
      },
      {
        id: "log_seed_2",
        adminId: "user_admin_1",
        action: "VIEW_STATS",
        entity: "screenings",
        description: "Admin membuka statistik hasil screening.",
        createdAt: nowOffset(0, 1),
      },
    ],
  });

  console.log("Database PsyScreening berhasil di-seed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
