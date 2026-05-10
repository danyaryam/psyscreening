import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../utils/validationSchemas.js";
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
router.get("/me", authMiddleware, asyncHandler(authController.me));

export default router;
