const DB_KEY = "psyscreening_mock_db_v1";

function createId(prefix) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function nowOffset(daysAgo = 0, hoursAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  return date.toISOString();
}

export const screeningQuestionSeed = [
  {
    id: "q_sleep_hours",
    key: "sleepHours",
    title: "Dalam 7 hari terakhir, rata-rata berapa jam Anda tidur setiap malam?",
    helperText: "Masukkan estimasi angka yang paling mendekati kondisi Anda.",
    inputType: "number",
    min: 0,
    max: 14,
    step: 0.5,
    placeholder: "Contoh: 6.5",
    required: true,
    order: 1,
  },
  {
    id: "q_sleep_quality",
    key: "sleepQuality",
    title: "Bagaimana kualitas tidur Anda belakangan ini?",
    helperText: "Pilih opsi yang paling menggambarkan kondisi Anda.",
    inputType: "choice",
    required: true,
    order: 2,
    options: [
      { label: "Nyenyak dan cukup konsisten", value: "baik" },
      { label: "Kadang terganggu", value: "cukup" },
      { label: "Sering terbangun / tidak nyenyak", value: "buruk" },
    ],
  },
  {
    id: "q_stress_level",
    key: "stressLevel",
    title: "Seberapa tinggi tingkat stres harian Anda saat ini?",
    helperText: "Geser dari 1 sangat rendah sampai 10 sangat tinggi.",
    inputType: "slider",
    min: 1,
    max: 10,
    step: 1,
    required: true,
    order: 3,
  },
  {
    id: "q_daily_activity",
    key: "activityLevel",
    title: "Bagaimana pola aktivitas harian Anda minggu ini?",
    helperText: "Perhatikan konsistensi rutinitas, energi, dan produktivitas.",
    inputType: "choice",
    required: true,
    order: 4,
    options: [
      { label: "Aktif dan relatif stabil", value: "tinggi" },
      { label: "Cukup aktif tetapi naik turun", value: "sedang" },
      { label: "Cenderung menurun / sulit konsisten", value: "rendah" },
    ],
  },
  {
    id: "q_mood",
    key: "moodState",
    title: "Bagaimana suasana hati Anda dalam beberapa hari terakhir?",
    helperText: "Pilih deskripsi yang paling sesuai.",
    inputType: "choice",
    required: true,
    order: 5,
    options: [
      { label: "Relatif stabil", value: "stabil" },
      { label: "Kadang mudah lelah / cemas", value: "berfluktuasi" },
      { label: "Sering sedih, kosong, atau tertekan", value: "menurun" },
    ],
  },
  {
    id: "q_social_support",
    key: "socialSupport",
    title: "Seberapa besar dukungan sosial yang Anda rasakan saat ini?",
    helperText: "Dukungan bisa dari keluarga, teman, pasangan, atau lingkungan kerja.",
    inputType: "choice",
    required: true,
    order: 6,
    options: [
      { label: "Saya merasa cukup didukung", value: "baik" },
      { label: "Ada dukungan, tetapi terbatas", value: "cukup" },
      { label: "Saya merasa cukup sendirian", value: "rendah" },
    ],
  },
  {
    id: "q_notes",
    key: "notes",
    title: "Apakah ada hal yang paling banyak memengaruhi kondisi mental Anda akhir-akhir ini?",
    helperText: "Opsional, isi bila Anda ingin memberi konteks tambahan.",
    inputType: "textarea",
    required: false,
    placeholder: "Tuliskan pemicu utama, kebiasaan, atau konteks pribadi Anda...",
    order: 7,
  },
];

function createQuestionSummary(answer) {
  if (!answer) return "-";
  if (typeof answer.displayValue === "string" && answer.displayValue.trim()) {
    return answer.displayValue;
  }
  return String(answer.value ?? "-");
}

function buildSeedDatabase() {
  const adminId = "user_admin_1";
  const userId = "user_dina_1";
  const secondUserId = "user_arya_1";

  const screeningId1 = "screening_seed_1";
  const sessionId1 = "session_seed_1";
  const resultId1 = "result_seed_1";

  const screeningId2 = "screening_seed_2";
  const sessionId2 = "session_seed_2";
  const resultId2 = "result_seed_2";

  const answers1 = [
    {
      id: createId("ans"),
      screeningId: screeningId1,
      questionId: "q_sleep_hours",
      questionKey: "sleepHours",
      value: 6,
      displayValue: "6 jam",
      createdAt: nowOffset(2, 3),
    },
    {
      id: createId("ans"),
      screeningId: screeningId1,
      questionId: "q_sleep_quality",
      questionKey: "sleepQuality",
      value: "cukup",
      displayValue: "Kadang terganggu",
      createdAt: nowOffset(2, 3),
    },
    {
      id: createId("ans"),
      screeningId: screeningId1,
      questionId: "q_stress_level",
      questionKey: "stressLevel",
      value: 7,
      displayValue: "7/10",
      createdAt: nowOffset(2, 3),
    },
    {
      id: createId("ans"),
      screeningId: screeningId1,
      questionId: "q_daily_activity",
      questionKey: "activityLevel",
      value: "sedang",
      displayValue: "Cukup aktif tetapi naik turun",
      createdAt: nowOffset(2, 3),
    },
    {
      id: createId("ans"),
      screeningId: screeningId1,
      questionId: "q_mood",
      questionKey: "moodState",
      value: "berfluktuasi",
      displayValue: "Kadang mudah lelah / cemas",
      createdAt: nowOffset(2, 3),
    },
    {
      id: createId("ans"),
      screeningId: screeningId1,
      questionId: "q_social_support",
      questionKey: "socialSupport",
      value: "cukup",
      displayValue: "Ada dukungan, tetapi terbatas",
      createdAt: nowOffset(2, 3),
    },
  ];

  const answers2 = [
    {
      id: createId("ans"),
      screeningId: screeningId2,
      questionId: "q_sleep_hours",
      questionKey: "sleepHours",
      value: 4.5,
      displayValue: "4.5 jam",
      createdAt: nowOffset(5, 6),
    },
    {
      id: createId("ans"),
      screeningId: screeningId2,
      questionId: "q_sleep_quality",
      questionKey: "sleepQuality",
      value: "buruk",
      displayValue: "Sering terbangun / tidak nyenyak",
      createdAt: nowOffset(5, 6),
    },
    {
      id: createId("ans"),
      screeningId: screeningId2,
      questionId: "q_stress_level",
      questionKey: "stressLevel",
      value: 9,
      displayValue: "9/10",
      createdAt: nowOffset(5, 6),
    },
    {
      id: createId("ans"),
      screeningId: screeningId2,
      questionId: "q_daily_activity",
      questionKey: "activityLevel",
      value: "rendah",
      displayValue: "Cenderung menurun / sulit konsisten",
      createdAt: nowOffset(5, 6),
    },
    {
      id: createId("ans"),
      screeningId: screeningId2,
      questionId: "q_mood",
      questionKey: "moodState",
      value: "menurun",
      displayValue: "Sering sedih, kosong, atau tertekan",
      createdAt: nowOffset(5, 6),
    },
    {
      id: createId("ans"),
      screeningId: screeningId2,
      questionId: "q_social_support",
      questionKey: "socialSupport",
      value: "rendah",
      displayValue: "Saya merasa cukup sendirian",
      createdAt: nowOffset(5, 6),
    },
  ];

  return {
    users: [
      {
        id: adminId,
        name: "Ayu Admin",
        email: "admin@psyscreening.id",
        password: "Admin123!",
        role: "admin",
        createdAt: nowOffset(30),
        updatedAt: nowOffset(0),
      },
      {
        id: userId,
        name: "Dina Maheswari",
        email: "dina@psyscreening.id",
        password: "User123!",
        role: "user",
        createdAt: nowOffset(18),
        updatedAt: nowOffset(0),
      },
      {
        id: secondUserId,
        name: "Arya Rahman",
        email: "arya@psyscreening.id",
        password: "User123!",
        role: "user",
        createdAt: nowOffset(11),
        updatedAt: nowOffset(0),
      },
    ],
    profiles: [
      {
        id: "profile_admin_1",
        userId: adminId,
        phone: "081200000001",
        occupation: "System Administrator",
        city: "Jakarta",
        birthDate: "1995-03-12",
        gender: "Perempuan",
        bio: "Mengelola operasional platform screening dan data admin.",
        emergencyContact: "Tim Ops - 081122223333",
        age: "",
        country: "",
        self_employed: "",
        family_history: "",
        no_employees: "",
        remote_work: "",
        coworkers: "",
      },
      {
        id: "profile_user_1",
        userId,
        phone: "081300000002",
        occupation: "Mahasiswa",
        city: "Bandung",
        birthDate: "2002-06-21",
        gender: "Perempuan",
        bio: "Sedang mencoba menjaga pola tidur dan aktivitas harian tetap stabil.",
        emergencyContact: "Ibu - 081344445555",
        age: "22",
        country: "Indonesia",
        self_employed: "no",
        family_history: "yes",
        no_employees: "no",
        remote_work: "no",
        coworkers: "yes",
      },
      {
        id: "profile_user_2",
        userId: secondUserId,
        phone: "081300000003",
        occupation: "UI Designer",
        city: "Yogyakarta",
        birthDate: "1999-01-09",
        gender: "Laki-laki",
        bio: "Aktif mengikuti program wellness perusahaan.",
        emergencyContact: "Kakak - 081366667777",
        age: "27",
        country: "Indonesia",
        self_employed: "no",
        family_history: "no",
        no_employees: "yes",
        remote_work: "yes",
        coworkers: "yes",
      },
    ],
    screenings: [
      {
        id: screeningId1,
        userId,
        sessionId: sessionId1,
        status: "completed",
        startedAt: nowOffset(2, 4),
        completedAt: nowOffset(2, 3),
        currentQuestionIndex: screeningQuestionSeed.length,
      },
      {
        id: screeningId2,
        userId: secondUserId,
        sessionId: sessionId2,
        status: "completed",
        startedAt: nowOffset(5, 7),
        completedAt: nowOffset(5, 6),
        currentQuestionIndex: screeningQuestionSeed.length,
      },
    ],
    screeningAnswers: [...answers1, ...answers2],
    screeningResults: [
      {
        id: resultId1,
        screeningId: screeningId1,
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
        disclaimer:
          "Hasil ini bersifat screening awal dan tidak menggantikan evaluasi profesional.",
        createdAt: nowOffset(2, 3),
      },
      {
        id: resultId2,
        screeningId: screeningId2,
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
        disclaimer:
          "Hasil ini bersifat screening awal dan tidak menggantikan evaluasi profesional.",
        createdAt: nowOffset(5, 6),
      },
    ],
    chatSessions: [
      {
        id: sessionId1,
        userId,
        screeningId: screeningId1,
        status: "completed",
        startedAt: nowOffset(2, 4),
        completedAt: nowOffset(2, 3),
      },
      {
        id: sessionId2,
        userId: secondUserId,
        screeningId: screeningId2,
        status: "completed",
        startedAt: nowOffset(5, 7),
        completedAt: nowOffset(5, 6),
      },
    ],
    chatMessages: [
      {
        id: createId("msg"),
        sessionId: sessionId1,
        sender: "system",
        content:
          "Halo Dina, terima kasih sudah meluangkan waktu. Kita akan mulai screening singkat kondisi mental Anda.",
        createdAt: nowOffset(2, 4),
      },
      {
        id: createId("msg"),
        sessionId: sessionId2,
        sender: "system",
        content:
          "Halo Arya, mari kita lakukan screening awal dengan beberapa pertanyaan terarah.",
        createdAt: nowOffset(5, 7),
      },
    ],
    screeningQuestions: screeningQuestionSeed.map((question) => ({
      ...question,
      isActive: true,
      createdAt: nowOffset(20),
      updatedAt: nowOffset(0),
    })),
    adminLogs: [
      {
        id: createId("log"),
        adminId,
        action: "LOGIN",
        entity: "auth",
        description: "Admin login ke dashboard monitoring.",
        createdAt: nowOffset(0, 2),
      },
      {
        id: createId("log"),
        adminId,
        action: "VIEW_STATS",
        entity: "screenings",
        description: "Admin membuka statistik hasil screening.",
        createdAt: nowOffset(0, 1),
      },
    ],
  };
}

export function loadDb() {
  const existing = window.localStorage.getItem(DB_KEY);

  if (!existing) {
    const seeded = buildSeedDatabase();
    window.localStorage.setItem(DB_KEY, JSON.stringify(seeded));
    return seeded;
  }

  return JSON.parse(existing);
}

export function saveDb(db) {
  window.localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function resetDb() {
  const seeded = buildSeedDatabase();
  saveDb(seeded);
  return seeded;
}

export function createEmptyScreeningBundle(userId) {
  const screeningId = createId("screening");
  const sessionId = createId("session");
  const startedAt = new Date().toISOString();

  return {
    screening: {
      id: screeningId,
      userId,
      sessionId,
      status: "in_progress",
      startedAt,
      completedAt: null,
      currentQuestionIndex: 0,
    },
    session: {
      id: sessionId,
      userId,
      screeningId,
      status: "active",
      startedAt,
      completedAt: null,
    },
  };
}

export function createMessage(sessionId, sender, content) {
  return {
    id: createId("msg"),
    sessionId,
    sender,
    content,
    createdAt: new Date().toISOString(),
  };
}

export function createAnswer(screeningId, question, value, displayValue) {
  return {
    id: createId("ans"),
    screeningId,
    questionId: question.id,
    questionKey: question.key,
    value,
    displayValue,
    createdAt: new Date().toISOString(),
  };
}

export function createAdminLog(adminId, action, entity, description) {
  return {
    id: createId("log"),
    adminId,
    action,
    entity,
    description,
    createdAt: new Date().toISOString(),
  };
}

export function buildScreeningSummary(db, screeningId) {
  return db.screeningAnswers
    .filter((answer) => answer.screeningId === screeningId)
    .map((answer) => {
      const question = db.screeningQuestions.find(
        (item) => item.id === answer.questionId,
      );

      return {
        questionId: answer.questionId,
        title: question?.title ?? answer.questionKey,
        value: createQuestionSummary(answer),
      };
    });
}
