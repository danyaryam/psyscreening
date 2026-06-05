import { AppError } from "../utils/AppError.js";

export function notFoundHandler(req, res, next) {
  next(new AppError(`Route ${req.method} ${req.originalUrl} tidak ditemukan.`, 404));
}
