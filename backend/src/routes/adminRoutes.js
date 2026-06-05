import { Router } from "express";
import * as adminController from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import {
  adminQuestionSchema,
  idParamSchema,
} from "../utils/validationSchemas.js";
import { z } from "zod";

const router = Router();

router.use(authMiddleware, roleMiddleware(["admin"]));

router.get("/users", asyncHandler(adminController.getUsers));
router.get(
  "/users/:id",
  validate(z.object({ params: idParamSchema })),
  asyncHandler(adminController.getUserById),
);
router.get("/screenings", asyncHandler(adminController.getScreenings));
router.get("/stats", asyncHandler(adminController.getStats));
router.get("/questions", asyncHandler(adminController.getQuestions));
router.post(
  "/questions",
  validate(z.object({ body: adminQuestionSchema })),
  asyncHandler(adminController.createQuestion),
);
router.put(
  "/questions/:id",
  validate(
    z.object({
      params: idParamSchema,
      body: adminQuestionSchema,
    }),
  ),
  asyncHandler(adminController.updateQuestion),
);
router.delete(
  "/questions/:id",
  validate(z.object({ params: idParamSchema })),
  asyncHandler(adminController.deleteQuestion),
);

export default router;
