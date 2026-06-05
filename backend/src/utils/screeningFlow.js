import { AppError } from "./AppError.js";

function getOptions(question) {
  return Array.isArray(question.options) ? question.options : [];
}

export function getCurrentQuestion(questions, currentQuestionIndex) {
  return questions[currentQuestionIndex] ?? null;
}

export function formatAnswerDisplay(question, value) {
  if (question.inputType === "slider") {
    return `${value}/10`;
  }

  if (question.inputType === "number") {
    return `${value} jam`;
  }

  if (question.inputType === "choice") {
    return (
      getOptions(question).find((option) => option.value === value)?.label ??
      String(value)
    );
  }

  return String(value);
}

export function normalizeAnswerValue(question, rawValue) {
  if (question.inputType === "slider" || question.inputType === "number") {
    const value = Number(rawValue);

    if (Number.isNaN(value)) {
      throw new AppError("Jawaban harus berupa angka yang valid.", 400);
    }

    if (question.min !== null && question.min !== undefined && value < question.min) {
      throw new AppError(`Nilai minimal untuk jawaban ini adalah ${question.min}.`, 400);
    }

    if (question.max !== null && question.max !== undefined && value > question.max) {
      throw new AppError(`Nilai maksimal untuk jawaban ini adalah ${question.max}.`, 400);
    }

    return value;
  }

  const stringValue = String(rawValue ?? "").trim();

  if (question.inputType === "choice") {
    const allowed = getOptions(question).map((option) => option.value);

    if (!allowed.includes(stringValue)) {
      throw new AppError("Pilihan jawaban tidak valid.", 400);
    }

    return stringValue;
  }

  if (question.required && !stringValue) {
    throw new AppError("Jawaban wajib diisi sebelum melanjutkan.", 400);
  }

  return stringValue;
}

export function mapAnswersToFeatures(answers) {
  return answers.reduce((accumulator, answer) => {
    accumulator[answer.questionKey] = answer.value;
    return accumulator;
  }, {});
}
