import { AppError } from "../utils/AppError.js";

function getErrorPayload(error) {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
      details: error.details ?? null,
    };
  }

  if (error?.code === "P2002") {
    return {
      statusCode: 409,
      message: "Data sudah digunakan dan harus unik.",
      details: error.meta ?? null,
    };
  }

  if (error?.name === "ZodError") {
    return {
      statusCode: 400,
      message: "Validasi request gagal.",
      details: error.errors,
    };
  }

  return {
    statusCode: 500,
    message: "Terjadi kesalahan pada server.",
    details: process.env.NODE_ENV === "development" ? error?.message : null,
  };
}

export function errorHandler(error, req, res, next) {
  const payload = getErrorPayload(error);

  if (payload.statusCode >= 500) {
    console.error(error);
  }

  res.status(payload.statusCode).json({
    message: payload.message,
    details: payload.details,
  });
}
