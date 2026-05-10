import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { updateProfileSchema } from "../utils/validationSchemas.js";
import { z } from "zod";

const router = Router();

router.use(authMiddleware);

router.get("/profile", asyncHandler(userController.getProfile));
router.put(
  "/profile",
  validate(z.object({ body: updateProfileSchema })),
  asyncHandler(userController.updateProfile),
);
router.get("/history", asyncHandler(userController.getHistory));

export default router;
