import axios from "axios";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

const REQUIRED_PROFILE_FIELDS = [
  { key: "age", label: "Age" },
  { key: "gender", label: "Gender" },
  { key: "country", label: "Country" },
  { key: "self_employed", label: "Self Employed" },
  { key: "family_history", label: "Family History" },
  { key: "no_employees", label: "No Employees" },
  { key: "remote_work", label: "Remote Work" },
  { key: "coworkers", label: "Coworkers" },
];

const apiClient = axios.create({
  baseURL: env.AI_ML_API_BASE_URL,
  timeout: 12000,
  headers: {
    "Content-Type": "application/json",
  },
});

function cleanString(value, fallback = "Unknown") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function normalizeYesNo(value, fallback = "no") {
  return value === "yes" || value === "no" ? value : fallback;
}

function normalizeGender(value) {
  const text = String(value ?? "").trim().toLowerCase();

  if (["male", "laki-laki", "laki", "pria"].includes(text)) {
    return "male";
  }

  if (["female", "perempuan", "wanita"].includes(text)) {
    return "female";
  }

  return cleanString(value);
}

function mapStressToWorkInterfere(stressLevel) {
  const stress = Number(stressLevel ?? 0);

  if (stress >= 8) return "often";
  if (stress >= 5) return "sometimes";
  if (stress >= 3) return "rarely";

  return "never";
}

function buildPredictionText(features) {
  const notes = cleanString(features.notes, "");

  const summary = [
    `Rata-rata tidur ${cleanString(features.sleepHours, "-")} jam`,
    `kualitas tidur ${cleanString(features.sleepQuality, "-")}`,
    `tingkat stres ${cleanString(features.stressLevel, "-")} dari 10`,
    `aktivitas ${cleanString(features.activityLevel, "-")}`,
    `suasana hati ${cleanString(features.moodState, "-")}`,
    `dukungan sosial ${cleanString(features.socialSupport, "-")}`,
  ].join(", ");

  return notes ? `${summary}. Catatan user: ${notes}` : summary;
}

export function assertAiMlProfileReady(profile) {
  const missingFields = REQUIRED_PROFILE_FIELDS.filter(({ key }) => {
    const value = profile?.[key];
    return value === null || value === undefined || String(value).trim() === "";
  });

  if (missingFields.length) {
    throw new AppError(
      "Lengkapi profil terlebih dahulu sebelum memproses analisis AI/ML.",
      400,
      {
        missingFields: missingFields.map((field) => field.label),
      },
    );
  }
}

export function buildAiMlPayload({ features, profile, createdAt = new Date() }) {
  assertAiMlProfileReady(profile);

  const stressLevel = Number(features.stressLevel ?? 0);

  return {
    text: buildPredictionText(features),
    Timestamp: new Date(createdAt).toISOString(),
    Age: cleanString(profile.age),
    Gender: normalizeGender(profile.gender),
    Country: cleanString(profile.country),
    state: cleanString(profile.city),
    self_employed: normalizeYesNo(profile.self_employed),
    family_history: normalizeYesNo(profile.family_history),
    work_interfere: mapStressToWorkInterfere(stressLevel),
    no_employees: normalizeYesNo(profile.no_employees),
    remote_work: normalizeYesNo(profile.remote_work),
    tech_company: "no",
    benefits: "no",
    care_options: "not sure",
    wellness_program: "no",
    seek_help: "no",
    anonymity: "yes",
    leave: stressLevel >= 8 ? "very difficult" : "somewhat easy",
    mental_health_consequence: stressLevel >= 7 ? "yes" : "maybe",
    phys_health_consequence: "no",
    coworkers: normalizeYesNo(profile.coworkers),
    supervisor: normalizeYesNo(profile.coworkers),
    mental_health_interview: "no",
    phys_health_interview: "maybe",
    mental_vs_physical: "yes",
    obs_consequence: normalizeYesNo(profile.family_history),
    comments: cleanString(features.notes, ""),
  };
}

export async function requestAiMlPrediction(payload) {
  const { data } = await apiClient.post("/predict", payload);
  return data;
}
