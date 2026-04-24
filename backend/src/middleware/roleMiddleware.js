import { AppError } from "../utils/AppError.js";

export function roleMiddleware(allowedRoles = []) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user?.role)) {
      next(new AppError("Anda tidak memiliki izin untuk mengakses resource ini.", 403));
      return;
    }

    next();
  };
}
