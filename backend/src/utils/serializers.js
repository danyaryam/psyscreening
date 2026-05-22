function toIso(date) {
  return date ? new Date(date).toISOString() : null;
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

export function serializeUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerified: Boolean(user.emailVerified),
    authProvider: user.authProvider ?? "local",
    avatar: user.avatar ?? null,
    createdAt: toIso(user.createdAt),
    updatedAt: toIso(user.updatedAt),
  };
}

export function serializeProfile(profile) {
  if (!profile) return null;

  return {
    id: profile.id,
    userId: profile.userId,
    phone: profile.phone ?? "",
    occupation: profile.occupation ?? "",
    city: profile.city ?? "",
    birthDate: profile.birthDate ?? "",
    gender: profile.gender ?? "",
    bio: profile.bio ?? "",
    emergencyContact: profile.emergencyContact ?? "",
    createdAt: toIso(profile.createdAt),
    updatedAt: toIso(profile.updatedAt),
  };
}

export function serializeQuestion(question) {
  if (!question) return null;

  return {
    id: question.id,
    key: question.key,
    title: question.title,
    helperText: question.helperText ?? "",
    inputType: question.inputType,
    placeholder: question.placeholder ?? "",
    min: question.min,
    max: question.max,
    step: question.step,
    required: question.required,
    order: question.order,
    isActive: question.isActive,
    options: ensureArray(question.options),
    createdAt: toIso(question.createdAt),
    updatedAt: toIso(question.updatedAt),
  };
}

export function serializeMessage(message) {
  return {
    id: message.id,
    sessionId: message.sessionId,
    sender: message.sender,
    content: message.content,
    createdAt: toIso(message.createdAt),
  };
}

export function serializeSession(session) {
  if (!session) return null;

  return {
    id: session.id,
    userId: session.userId,
    screeningId: session.screeningId,
    status: session.status,
    startedAt: toIso(session.startedAt),
    completedAt: toIso(session.completedAt),
    createdAt: toIso(session.createdAt),
    updatedAt: toIso(session.updatedAt),
  };
}

export function serializeResult(result) {
  if (!result) return null;

  return {
    id: result.id,
    screeningId: result.screeningId,
    riskLevel: result.riskLevel,
    score: result.score,
    modelUsed: result.modelUsed,
    insights: ensureArray(result.insights),
    recommendations: ensureArray(result.recommendations),
    disclaimer: result.disclaimer,
    createdAt: toIso(result.createdAt),
  };
}

export function buildSummaryFromAnswers(answers, questionsMap = new Map()) {
  return [...answers]
    .sort((left, right) => {
      const leftOrder = questionsMap.get(left.questionId)?.order ?? 999;
      const rightOrder = questionsMap.get(right.questionId)?.order ?? 999;
      return leftOrder - rightOrder;
    })
    .map((answer) => ({
      questionId: answer.questionId,
      title:
        questionsMap.get(answer.questionId)?.title ??
        questionsMap.get(answer.questionKey)?.title ??
        answer.questionKey,
      value:
        typeof answer.displayValue === "string" && answer.displayValue.trim()
          ? answer.displayValue
          : String(answer.value ?? "-"),
    }));
}

export function serializeScreening(screening, questionsMap = new Map()) {
  return {
    id: screening.id,
    userId: screening.userId,
    sessionId: screening.chatSession?.id ?? null,
    status: screening.status,
    startedAt: toIso(screening.startedAt),
    completedAt: toIso(screening.completedAt),
    createdAt: toIso(screening.createdAt),
    updatedAt: toIso(screening.updatedAt),
    currentQuestionIndex: screening.currentQuestionIndex,
    result: serializeResult(screening.result),
    summary: buildSummaryFromAnswers(screening.answers ?? [], questionsMap),
  };
}

export function serializeAdminLog(log) {
  return {
    id: log.id,
    adminId: log.adminId,
    action: log.action,
    entity: log.entity,
    description: log.description,
    createdAt: toIso(log.createdAt),
    admin: serializeUser(log.admin),
  };
}
