import { MEDICAL_DISCLAIMER } from "@/utils/constants";
import {
  buildScreeningSummary,
  createAdminLog,
  createAnswer,
  createEmptyScreeningBundle,
  createMessage,
  loadDb,
  saveDb,
} from "./storage";

const MOCK_DELAY = 450;

function delay(ms = MOCK_DELAY) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
}

function createToken(userId) {
  return `mock-token:${userId}`;
}

function getUserFromToken(db, token) {
  if (!token || !token.startsWith("mock-token:")) return null;
  const userId = token.replace("mock-token:", "");
  return db.users.find((user) => user.id === userId) ?? null;
}

function requireAuth(token) {
  const db = loadDb();
  const user = getUserFromToken(db, token);

  if (!user) {
    throw new Error("Sesi login Anda tidak valid. Silakan login ulang.");
  }

  return { db, user };
}

function requireAdmin(token) {
  const { db, user } = requireAuth(token);

  if (user.role !== "admin") {
    throw new Error("Akses admin diperlukan untuk membuka data ini.");
  }

  return { db, user };
}

function formatAnswerDisplay(question, value) {
  if (question.inputType === "slider") {
    return `${value}/10`;
  }

  if (question.inputType === "number") {
    return `${value} jam`;
  }

  if (question.inputType === "choice") {
    return (
      question.options.find((option) => option.value === value)?.label ?? String(value)
    );
  }

  return String(value);
}

function mapAnswersToFeatures(db, screeningId) {
  const answers = db.screeningAnswers.filter(
    (answer) => answer.screeningId === screeningId,
  );

  return answers.reduce((accumulator, answer) => {
    accumulator[answer.questionKey] = answer.value;
    return accumulator;
  }, {});
}

function generatePrediction(features) {
  const sleepHours = Number(features.sleepHours ?? 7);
  const stressLevel = Number(features.stressLevel ?? 5);
  const sleepQualityPenalty = {
    baik: 5,
    cukup: 12,
    buruk: 20,
  }[features.sleepQuality ?? "cukup"];
  const activityPenalty = {
    tinggi: 3,
    sedang: 10,
    rendah: 18,
  }[features.activityLevel ?? "sedang"];
  const moodPenalty = {
    stabil: 4,
    berfluktuasi: 12,
    menurun: 20,
  }[features.moodState ?? "stabil"];
  const supportPenalty = {
    baik: 2,
    cukup: 8,
    rendah: 14,
  }[features.socialSupport ?? "cukup"];

  const sleepPenalty =
    sleepHours >= 7 && sleepHours <= 9
      ? 4
      : sleepHours >= 6
        ? 10
        : 18;

  const score = Math.max(
    22,
    Math.min(
      96,
      Math.round(
        10 +
          sleepPenalty +
          sleepQualityPenalty +
          activityPenalty +
          moodPenalty +
          supportPenalty +
          stressLevel * 4,
      ),
    ),
  );

  const riskLevel = score >= 75 ? "tinggi" : score >= 50 ? "sedang" : "rendah";
  const modelUsed =
    score >= 75
      ? "Random Forest"
      : score >= 50
        ? "Decision Tree"
        : "Logistic Regression";

  const insights = [];
  const recommendations = [];

  if (sleepHours < 6.5 || features.sleepQuality === "buruk") {
    insights.push("Pola tidur terlihat kurang stabil dalam beberapa hari terakhir.");
    recommendations.push("Atur jadwal tidur yang lebih konsisten dan kurangi stimulasi sebelum tidur.");
  }

  if (stressLevel >= 7) {
    insights.push("Tingkat stres harian cenderung tinggi dan berpotensi memengaruhi fokus serta emosi.");
    recommendations.push("Sisihkan waktu jeda singkat untuk relaksasi atau aktivitas pemulihan yang sederhana.");
  }

  if (features.activityLevel === "rendah") {
    insights.push("Aktivitas harian tampak menurun sehingga ritme keseharian mungkin ikut terdampak.");
    recommendations.push("Mulai dari target aktivitas kecil yang realistis agar rutinitas perlahan kembali stabil.");
  }

  if (features.moodState === "menurun") {
    insights.push("Suasana hati menunjukkan tanda penurunan yang perlu dipantau lebih lanjut.");
    recommendations.push("Pertimbangkan berbicara dengan orang tepercaya atau profesional jika kondisi terasa menetap.");
  }

  if (features.socialSupport === "rendah") {
    insights.push("Dukungan sosial yang dirasakan saat ini tampak terbatas.");
    recommendations.push("Coba jangkau satu orang yang aman dan suportif untuk berbagi kondisi Anda.");
  }

  if (!insights.length) {
    insights.push("Kondisi umum terlihat relatif stabil, tetapi tetap penting menjaga pola tidur, stres, dan aktivitas.");
  }

  if (!recommendations.length) {
    recommendations.push("Pertahankan kebiasaan sehat yang sudah berjalan baik dan evaluasi kondisi secara berkala.");
  }

  return {
    riskLevel,
    score,
    modelUsed,
    insights: insights.slice(0, 3),
    recommendations: recommendations.slice(0, 3),
    disclaimer: MEDICAL_DISCLAIMER,
  };
}

function attachResult(db, screening) {
  const result = db.screeningResults.find(
    (item) => item.screeningId === screening.id,
  );

  return {
    ...screening,
    result,
    summary: buildScreeningSummary(db, screening.id),
  };
}

function getCurrentQuestion(db, screening) {
  return db.screeningQuestions
    .filter((question) => question.isActive)
    .sort((a, b) => a.order - b.order)[screening.currentQuestionIndex] ?? null;
}

function getSessionMessages(db, sessionId) {
  return db.chatMessages
    .filter((message) => message.sessionId === sessionId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

export const mockApi = {
  async register(payload) {
    await delay();
    const db = loadDb();
    const exists = db.users.some((user) => user.email === payload.email);

    if (exists) {
      throw new Error("Email sudah terdaftar. Gunakan email lain.");
    }

    const user = {
      id: `user_${Date.now()}`,
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const profile = {
      id: `profile_${Date.now()}`,
      userId: user.id,
      phone: "",
      occupation: "",
      city: "",
      birthDate: "",
      gender: "",
      bio: "",
      emergencyContact: "",
    };

    db.users.push(user);
    db.profiles.push(profile);
    saveDb(db);

    return {
      token: createToken(user.id),
      user: sanitizeUser(user),
    };
  },

  async login(payload) {
    await delay();
    const db = loadDb();
    const user = db.users.find((item) => item.email === payload.email);

    if (!user || user.password !== payload.password) {
      throw new Error("Email atau password tidak sesuai.");
    }

    if (user.role === "admin") {
      db.adminLogs.unshift(
        createAdminLog(user.id, "LOGIN", "auth", "Admin login ke dashboard."),
      );
      saveDb(db);
    }

    return {
      token: createToken(user.id),
      user: sanitizeUser(user),
    };
  },

  async getCurrentUser(token) {
    await delay(180);
    const { user } = requireAuth(token);
    return { user: sanitizeUser(user) };
  },

  async getProfile(token) {
    await delay();
    const { db, user } = requireAuth(token);
    const profile = db.profiles.find((item) => item.userId === user.id) ?? null;
    return {
      user: sanitizeUser(user),
      profile,
    };
  },

  async updateProfile(token, payload) {
    await delay();
    const { db, user } = requireAuth(token);
    const profileIndex = db.profiles.findIndex((item) => item.userId === user.id);

    db.users = db.users.map((item) =>
      item.id === user.id
        ? {
            ...item,
            name: payload.name ?? item.name,
            updatedAt: new Date().toISOString(),
          }
        : item,
    );

    if (profileIndex >= 0) {
      db.profiles[profileIndex] = {
        ...db.profiles[profileIndex],
        ...payload,
      };
    }

    saveDb(db);

    return this.getProfile(token);
  },

  async getUserHistory(token) {
    await delay();
    const { db, user } = requireAuth(token);
    const items = db.screenings
      .filter((screening) => screening.userId === user.id && screening.status === "completed")
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .map((screening) => attachResult(db, screening));

    return { items };
  },

  async getScreenings(token) {
    return this.getUserHistory(token);
  },

  async getScreeningById(token, screeningId) {
    await delay();
    const { db, user } = requireAuth(token);
    const screening = db.screenings.find((item) => item.id === screeningId);

    if (!screening) {
      throw new Error("Data screening tidak ditemukan.");
    }

    if (user.role !== "admin" && screening.userId !== user.id) {
      throw new Error("Anda tidak memiliki akses ke hasil screening ini.");
    }

    const session = db.chatSessions.find((item) => item.id === screening.sessionId) ?? null;

    return {
      item: {
        ...attachResult(db, screening),
        messages: session ? getSessionMessages(db, session.id) : [],
      },
    };
  },

  async startScreening(token) {
    await delay();
    const { db, user } = requireAuth(token);
    const active = db.screenings.find(
      (screening) => screening.userId === user.id && screening.status === "in_progress",
    );

    if (active) {
      return {
        screening: active,
        session: db.chatSessions.find((item) => item.id === active.sessionId),
        questions: db.screeningQuestions
          .filter((question) => question.isActive)
          .sort((a, b) => a.order - b.order),
        currentQuestion: getCurrentQuestion(db, active),
        messages: getSessionMessages(db, active.sessionId),
        answers: buildScreeningSummary(db, active.id),
      };
    }

    const bundle = createEmptyScreeningBundle(user.id);
    db.screenings.push(bundle.screening);
    db.chatSessions.push(bundle.session);
    db.chatMessages.push(
      createMessage(
        bundle.session.id,
        "system",
        `Halo ${user.name.split(" ")[0]}, saya akan memandu screening singkat untuk memahami pola tidur, stres, aktivitas, dan suasana hati Anda.`,
      ),
    );
    db.chatMessages.push(
      createMessage(
        bundle.session.id,
        "system",
        "Jawab sejujur mungkin ya. Hasil ini hanya untuk screening awal, bukan diagnosis profesional.",
      ),
    );
    db.chatMessages.push(
      createMessage(
        bundle.session.id,
        "system",
        db.screeningQuestions
          .filter((question) => question.isActive)
          .sort((a, b) => a.order - b.order)[0].title,
      ),
    );
    saveDb(db);

    return {
      screening: bundle.screening,
      session: bundle.session,
      questions: db.screeningQuestions
        .filter((question) => question.isActive)
        .sort((a, b) => a.order - b.order),
      currentQuestion: getCurrentQuestion(db, bundle.screening),
      messages: getSessionMessages(db, bundle.session.id),
      answers: [],
    };
  },

  async answerScreening(token, payload) {
    await delay();
    const { db, user } = requireAuth(token);
    const screening = db.screenings.find((item) => item.id === payload.screeningId);

    if (!screening || screening.userId !== user.id) {
      throw new Error("Screening aktif tidak ditemukan.");
    }

    const question = db.screeningQuestions.find((item) => item.id === payload.questionId);
    if (!question) {
      throw new Error("Pertanyaan tidak ditemukan.");
    }

    const displayValue = formatAnswerDisplay(question, payload.value);
    const existingIndex = db.screeningAnswers.findIndex(
      (item) =>
        item.screeningId === screening.id && item.questionId === question.id,
    );
    const answer = createAnswer(screening.id, question, payload.value, displayValue);

    if (existingIndex >= 0) {
      db.screeningAnswers[existingIndex] = answer;
    } else {
      db.screeningAnswers.push(answer);
    }

    db.chatMessages.push(createMessage(screening.sessionId, "user", displayValue));

    screening.currentQuestionIndex += 1;

    const nextQuestion = getCurrentQuestion(db, screening);
    if (nextQuestion) {
      db.chatMessages.push(createMessage(screening.sessionId, "system", nextQuestion.title));
    } else {
      db.chatMessages.push(
        createMessage(
          screening.sessionId,
          "system",
          "Semua jawaban telah terkumpul. Silakan tinjau ringkasan sebelum mengirim ke model screening.",
        ),
      );
    }

    saveDb(db);

    return {
      screening,
      currentQuestion: nextQuestion,
      messages: getSessionMessages(db, screening.sessionId),
      answers: buildScreeningSummary(db, screening.id),
      isComplete: !nextQuestion,
    };
  },

  async submitScreening(token, payload) {
    await delay(650);
    const { db, user } = requireAuth(token);
    const screening = db.screenings.find((item) => item.id === payload.screeningId);

    if (!screening || screening.userId !== user.id) {
      throw new Error("Data screening tidak ditemukan.");
    }

    const features = mapAnswersToFeatures(db, screening.id);
    const prediction = generatePrediction(features);
    const result = {
      id: `result_${Date.now()}`,
      screeningId: screening.id,
      ...prediction,
      createdAt: new Date().toISOString(),
    };

    const existingResultIndex = db.screeningResults.findIndex(
      (item) => item.screeningId === screening.id,
    );

    if (existingResultIndex >= 0) {
      db.screeningResults[existingResultIndex] = result;
    } else {
      db.screeningResults.push(result);
    }

    screening.status = "completed";
    screening.completedAt = new Date().toISOString();
    const session = db.chatSessions.find((item) => item.id === screening.sessionId);
    if (session) {
      session.status = "completed";
      session.completedAt = new Date().toISOString();
    }

    db.chatMessages.push(
      createMessage(
        screening.sessionId,
        "system",
        `Analisis selesai. Level risiko Anda saat ini: ${prediction.riskLevel.toUpperCase()} dengan skor ${prediction.score}/100.`,
      ),
    );

    saveDb(db);

    return {
      screeningId: screening.id,
      resultId: result.id,
      result,
      summary: buildScreeningSummary(db, screening.id),
    };
  },

  async getAdminUsers(token) {
    await delay();
    const { db, user } = requireAdmin(token);
    db.adminLogs.unshift(
      createAdminLog(user.id, "VIEW_USERS", "users", "Admin membuka daftar users."),
    );
    saveDb(db);

    const items = db.users
      .filter((member) => member.role === "user")
      .map((member) => {
        const profile = db.profiles.find((item) => item.userId === member.id) ?? null;
        const latestScreening = db.screenings
          .filter((item) => item.userId === member.id && item.status === "completed")
          .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];
        const result = latestScreening
          ? db.screeningResults.find((item) => item.screeningId === latestScreening.id)
          : null;

        return {
          ...sanitizeUser(member),
          profile,
          screeningsCount: db.screenings.filter((item) => item.userId === member.id).length,
          latestRiskLevel: result?.riskLevel ?? null,
          latestScore: result?.score ?? null,
          latestScreeningAt: latestScreening?.completedAt ?? null,
        };
      });

    return { items };
  },

  async getAdminUserById(token, userId) {
    await delay();
    const { db } = requireAdmin(token);
    const user = db.users.find((item) => item.id === userId && item.role === "user");

    if (!user) {
      throw new Error("User tidak ditemukan.");
    }

    return {
      item: {
        ...sanitizeUser(user),
        profile: db.profiles.find((item) => item.userId === user.id) ?? null,
        screenings: db.screenings
          .filter((screening) => screening.userId === user.id)
          .map((screening) => attachResult(db, screening)),
      },
    };
  },

  async getAdminScreenings(token) {
    await delay();
    const { db, user } = requireAdmin(token);
    db.adminLogs.unshift(
      createAdminLog(user.id, "VIEW_SCREENINGS", "screenings", "Admin membuka data screening."),
    );
    saveDb(db);

    return {
      items: db.screenings
        .filter((screening) => screening.status === "completed")
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
        .map((screening) => {
          const owner = db.users.find((member) => member.id === screening.userId);
          return {
            ...attachResult(db, screening),
            user: sanitizeUser(owner),
          };
        }),
    };
  },

  async getAdminStats(token) {
    await delay();
    const { db } = requireAdmin(token);
    const completed = db.screenings.filter((item) => item.status === "completed");
    const results = db.screeningResults;
    const riskCounts = {
      rendah: results.filter((item) => item.riskLevel === "rendah").length,
      sedang: results.filter((item) => item.riskLevel === "sedang").length,
      tinggi: results.filter((item) => item.riskLevel === "tinggi").length,
    };

    const averageScore = results.length
      ? Math.round(results.reduce((sum, item) => sum + item.score, 0) / results.length)
      : 0;

    return {
      summary: {
        totalUsers: db.users.filter((item) => item.role === "user").length,
        totalScreenings: completed.length,
        averageScore,
        activeQuestions: db.screeningQuestions.filter((item) => item.isActive).length,
      },
      riskCounts,
      recentLogs: db.adminLogs
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6)
        .map((log) => ({
          ...log,
          admin: sanitizeUser(db.users.find((user) => user.id === log.adminId)),
        })),
    };
  },

  async getAdminQuestions(token) {
    await delay();
    const { db } = requireAdmin(token);
    return {
      items: db.screeningQuestions.slice().sort((a, b) => a.order - b.order),
    };
  },

  async createQuestion(token, payload) {
    await delay();
    const { db, user } = requireAdmin(token);
    const question = {
      id: `question_${Date.now()}`,
      key: payload.key,
      title: payload.title,
      helperText: payload.helperText ?? "",
      inputType: payload.inputType,
      placeholder: payload.placeholder ?? "",
      min: payload.min ?? null,
      max: payload.max ?? null,
      step: payload.step ?? null,
      required: payload.required ?? true,
      options: payload.options ?? [],
      order:
        payload.order ??
        Math.max(...db.screeningQuestions.map((item) => item.order), 0) + 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.screeningQuestions.push(question);
    db.adminLogs.unshift(
      createAdminLog(user.id, "CREATE_QUESTION", "screening_questions", `Menambah pertanyaan "${payload.title}".`),
    );
    saveDb(db);
    return { item: question };
  },

  async updateQuestion(token, questionId, payload) {
    await delay();
    const { db, user } = requireAdmin(token);
    const index = db.screeningQuestions.findIndex((item) => item.id === questionId);

    if (index < 0) {
      throw new Error("Pertanyaan tidak ditemukan.");
    }

    db.screeningQuestions[index] = {
      ...db.screeningQuestions[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    db.adminLogs.unshift(
      createAdminLog(
        user.id,
        "UPDATE_QUESTION",
        "screening_questions",
        `Mengubah pertanyaan "${db.screeningQuestions[index].title}".`,
      ),
    );
    saveDb(db);
    return { item: db.screeningQuestions[index] };
  },

  async deleteQuestion(token, questionId) {
    await delay();
    const { db, user } = requireAdmin(token);
    const question = db.screeningQuestions.find((item) => item.id === questionId);

    if (!question) {
      throw new Error("Pertanyaan tidak ditemukan.");
    }

    db.screeningQuestions = db.screeningQuestions.filter((item) => item.id !== questionId);
    db.adminLogs.unshift(
      createAdminLog(
        user.id,
        "DELETE_QUESTION",
        "screening_questions",
        `Menghapus pertanyaan "${question.title}".`,
      ),
    );
    saveDb(db);
    return { success: true };
  },
};
