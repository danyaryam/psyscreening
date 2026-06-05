import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  googleAuthSchema,
  loginSchema,
  registerSchema,
  resendVerificationSchema,
  verifyEmailQuerySchema,
} from "../utils/validationSchemas.js";
import { z } from "zod";

const router = Router();

router.post(
  "/register",
  validate(z.object({ body: registerSchema })),
  asyncHandler(authController.register),
);
router.post(
  "/login",
  validate(z.object({ body: loginSchema })),
  asyncHandler(authController.login),
);
router.get(
  "/verify-email",
  validate(z.object({ query: verifyEmailQuerySchema })),
  asyncHandler(authController.verifyEmail),
);
router.post(
  "/resend-verification",
  validate(z.object({ body: resendVerificationSchema })),
  asyncHandler(authController.resendVerification),
);
router.post(
  "/google",
  validate(z.object({ body: googleAuthSchema })),
  asyncHandler(authController.google),
);
router.get("/me", authMiddleware, asyncHandler(authController.me));

export default router;
