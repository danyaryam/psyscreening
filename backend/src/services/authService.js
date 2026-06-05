import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";
import { serializeUser } from "../utils/serializers.js";
import { signToken } from "./tokenService.js";
import { createAdminLog } from "./adminLogService.js";
import { ensureEmailServiceReady, sendVerificationEmail } from "./emailService.js";

const VERIFICATION_TOKEN_HOURS = 24;

function createVerificationToken() {
  return crypto.randomBytes(32).toString("hex");
}

function createVerificationExpiry() {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + VERIFICATION_TOKEN_HOURS);
  return expiresAt;
}

function buildAuthResponse(user) {
  return {
    token: signToken(user),
    user: serializeUser(user),
  };
}

export async function registerUser(payload) {
  const email = payload.email.trim().toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email } });

  if (exists) {
    throw new AppError("Email sudah terdaftar. Gunakan email lain.", 409);
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const verificationToken = env.REQUIRE_EMAIL_VERIFICATION ? createVerificationToken() : null;
  const verificationExpires = env.REQUIRE_EMAIL_VERIFICATION ? createVerificationExpiry() : null;

  if (env.REQUIRE_EMAIL_VERIFICATION) {
    ensureEmailServiceReady();
  }

  const user = await prisma.user.create({
    data: {
      name: payload.name.trim(),
      email,
      passwordHash,
      role: "user",
      emailVerified: !env.REQUIRE_EMAIL_VERIFICATION,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
      authProvider: "local",
      profile: {
        create: {},
      },
    },
  });

  if (!env.REQUIRE_EMAIL_VERIFICATION) {
    return {
      message: "Registrasi berhasil. Anda langsung masuk ke dashboard.",
      ...buildAuthResponse(user),
    };
  }

  try {
    await sendVerificationEmail(user.email, verificationToken);
  } catch (error) {
    console.error("Verification email delivery failed", {
      code: error?.code,
      command: error?.command,
      responseCode: error?.responseCode,
      smtpResponse: typeof error?.response === "string" ? error.response : undefined,
      httpStatus: error?.response?.status,
      httpData: error?.response?.data,
    });

    await prisma.user.delete({ where: { id: user.id } }).catch(() => null);
    throw new AppError(
      "Gagal mengirim email verifikasi. Periksa konfigurasi layanan email lalu coba registrasi ulang.",
      503,
      env.NODE_ENV === "development" ? error?.message : null,
    );
  }

  return {
    message:
      "Registrasi berhasil. Silakan cek email Anda, lalu klik Verifikasi Email untuk langsung masuk ke dashboard.",
  };
}

export async function loginUser(payload) {
  const email = payload.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError("Email atau password tidak sesuai.", 401);
  }

  if (!user.passwordHash) {
    throw new AppError("Akun ini menggunakan Google. Silakan masuk dengan Google.", 401);
  }

  const isValid = await bcrypt.compare(payload.password, user.passwordHash);

  if (!isValid) {
    throw new AppError("Email atau password tidak sesuai.", 401);
  }

  if (!user.emailVerified) {
    throw new AppError("Email belum diverifikasi. Silakan cek email verifikasi Anda.", 403);
  }

  if (user.role === "admin") {
    await createAdminLog(user.id, "LOGIN", "auth", "Admin login ke dashboard.");
  }

  return buildAuthResponse(user);
}

export async function verifyEmail(token) {
  const user = await prisma.user.findUnique({
    where: { emailVerificationToken: token },
  });

  if (!user || !user.emailVerificationExpires) {
    throw new AppError("Token verifikasi tidak valid atau sudah digunakan.", 400);
  }

  if (user.emailVerificationExpires < new Date()) {
    throw new AppError("Token verifikasi sudah kedaluwarsa. Silakan kirim ulang verifikasi.", 400);
  }

  const verifiedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    },
  });

  return {
    message: "Email berhasil diverifikasi. Anda akan diarahkan ke dashboard.",
    ...buildAuthResponse(verifiedUser),
  };
}

export async function resendVerification(payload) {
  const email = payload.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  const genericMessage =
    "Jika email masih membutuhkan verifikasi, link verifikasi baru akan kami kirimkan.";

  if (!user || user.emailVerified) {
    return { message: genericMessage };
  }

  const verificationToken = createVerificationToken();
  const verificationExpires = createVerificationExpiry();
  ensureEmailServiceReady();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    },
  });

  await sendVerificationEmail(user.email, verificationToken);

  return { message: genericMessage };
}

export async function googleAuth(credential) {
  if (!env.GOOGLE_CLIENT_ID) {
    throw new AppError("Google OAuth belum dikonfigurasi.", 503);
  }

  const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  let ticket;

  try {
    ticket = await client.verifyIdToken({
      idToken: credential,
      audience: env.GOOGLE_CLIENT_ID,
    });
  } catch {
    throw new AppError("Token Google tidak valid.", 401);
  }

  const payload = ticket.getPayload();

  if (!payload?.email || !payload.sub) {
    throw new AppError("Token Google tidak valid.", 401);
  }

  if (!payload.email_verified) {
    throw new AppError("Email Google belum terverifikasi.", 401);
  }

  const email = payload.email.trim().toLowerCase();
  const googleId = payload.sub;
  const name = payload.name?.trim() || email.split("@")[0];
  const avatar = payload.picture ?? null;

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    const user = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        googleId: existingUser.googleId ?? googleId,
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        authProvider: existingUser.passwordHash ? existingUser.authProvider : "google",
        avatar: existingUser.avatar ?? avatar,
      },
    });

    if (user.role === "admin") {
      await createAdminLog(user.id, "LOGIN", "auth", "Admin login dengan Google.");
    }

    return buildAuthResponse(user);
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: null,
      googleId,
      emailVerified: true,
      authProvider: "google",
      avatar,
      role: "user",
      profile: {
        create: {},
      },
    },
  });

  return buildAuthResponse(user);
}

export async function getCurrentUser(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("User tidak ditemukan.", 404);
  }

  return { user: serializeUser(user) };
}
