import axios from "axios";
import { env } from "../config/env.js";
import { MEDICAL_DISCLAIMER } from "../utils/constants.js";

function generateMockPrediction(features) {
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
    sleepHours >= 7 && sleepHours <= 9 ? 4 : sleepHours >= 6 ? 10 : 18;

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
    recommendations.push(
      "Atur jadwal tidur yang lebih konsisten dan kurangi stimulasi sebelum tidur.",
    );
  }

  if (stressLevel >= 7) {
    insights.push(
      "Tingkat stres harian cenderung tinggi dan berpotensi memengaruhi fokus serta emosi.",
    );
    recommendations.push(
      "Sisihkan waktu jeda singkat untuk relaksasi atau aktivitas pemulihan yang sederhana.",
    );
  }

  if (features.activityLevel === "rendah") {
    insights.push(
      "Aktivitas harian tampak menurun sehingga ritme keseharian mungkin ikut terdampak.",
    );
    recommendations.push(
      "Mulai dari target aktivitas kecil yang realistis agar rutinitas perlahan kembali stabil.",
    );
  }

  if (features.moodState === "menurun") {
    insights.push(
      "Suasana hati menunjukkan tanda penurunan yang perlu dipantau lebih lanjut.",
    );
    recommendations.push(
      "Pertimbangkan berbicara dengan orang tepercaya atau profesional jika kondisi terasa menetap.",
    );
  }

  if (features.socialSupport === "rendah") {
    insights.push("Dukungan sosial yang dirasakan saat ini tampak terbatas.");
    recommendations.push(
      "Coba jangkau satu orang yang aman dan suportif untuk berbagi kondisi Anda.",
    );
  }

  if (!insights.length) {
    insights.push(
      "Kondisi umum terlihat relatif stabil, tetapi tetap penting menjaga pola tidur, stres, dan aktivitas.",
    );
  }

  if (!recommendations.length) {
    recommendations.push(
      "Pertahankan kebiasaan sehat yang sudah berjalan baik dan evaluasi kondisi secara berkala.",
    );
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

export async function predictScreening(features) {
  if (env.ML_PROVIDER === "remote" && env.ML_SERVICE_URL) {
    const { data } = await axios.post(env.ML_SERVICE_URL, { features });
    return data;
  }

  return generateMockPrediction(features);
}
