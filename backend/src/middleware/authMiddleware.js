import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";
import { verifyToken } from "../services/tokenService.js";

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError("Token autentikasi tidak ditemukan.", 401);
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const payload = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new AppError("Sesi login Anda tidak valid. Silakan login ulang.", 401);
    }

    req.user = {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError("Token tidak valid.", 401));
  }
}
