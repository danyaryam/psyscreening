import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";
import { serializeUser } from "../utils/serializers.js";
import { signToken } from "./tokenService.js";
import { createAdminLog } from "./adminLogService.js";

export async function registerUser(payload) {
  const email = payload.email.trim().toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email } });

  if (exists) {
    throw new AppError("Email sudah terdaftar. Gunakan email lain.", 409);
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);

  const user = await prisma.user.create({
    data: {
      name: payload.name.trim(),
      email,
      passwordHash,
      role: "user",
      profile: {
        create: {},
      },
    },
  });

  return {
    token: signToken(user),
    user: serializeUser(user),
  };
}

export async function loginUser(payload) {
  const email = payload.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError("Email atau password tidak sesuai.", 401);
  }

  const isValid = await bcrypt.compare(payload.password, user.passwordHash);

  if (!isValid) {
    throw new AppError("Email atau password tidak sesuai.", 401);
  }

  if (user.role === "admin") {
    await createAdminLog(user.id, "LOGIN", "auth", "Admin login ke dashboard.");
  }

  return {
    token: signToken(user),
    user: serializeUser(user),
  };
}

export async function getCurrentUser(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new AppError("User tidak ditemukan.", 404);
  }

  return { user: serializeUser(user) };
}
