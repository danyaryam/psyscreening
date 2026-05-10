import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";

// GET - Ambil semua hasil screening
export async function getAllResults() {
  const results = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!results || results.length === 0) {
    throw new AppError("Data hasil screening tidak ditemukan", 404);
  }

  return results;
}

// GET - Ambil hasil screening by ID
export async function getResultById(id) {
  const result = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profile: true,
      createdAt: true,
    },
  });

  if (!result) {
    throw new AppError("Data hasil screening tidak ditemukan", 404);
  }

  return result;
}

// POST - Buat hasil screening baru
export async function createResult(payload) {
  // Validasi input sederhana
  if (!payload.name || !payload.email) {
    throw new AppError("Name dan email wajib diisi", 400);
  }

  // Cek apakah email sudah ada
  const exists = await prisma.user.findUnique({
    where: { email: payload.email.toLowerCase() },
  });

  if (exists) {
    throw new AppError("Email sudah digunakan", 409);
  }

  // Buat data baru
  const result = await prisma.user.create({
    data: {
      name: payload.name.trim(),
      email: payload.email.toLowerCase(),
      passwordHash: "temp_hash", // Sederhana dulu, nanti bisa diubah
      role: payload.role || "user",
      profile: {
        create: {
          phone: payload.phone || null,
          occupation: payload.occupation || null,
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profile: true,
      createdAt: true,
    },
  });

  return result;
}
