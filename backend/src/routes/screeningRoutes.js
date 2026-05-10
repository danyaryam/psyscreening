import { Router } from "express";
import * as screeningController from "../controllers/screeningController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import {
  answerScreeningSchema,
  idParamSchema,
  submitScreeningSchema,
} from "../utils/validationSchemas.js";
import { z } from "zod";

const router = Router();

router.use(authMiddleware);

router.post("/start", asyncHandler(screeningController.start));
router.post(
  "/answer",
  validate(z.object({ body: answerScreeningSchema })),
  asyncHandler(screeningController.answer),
);
router.post(
  "/submit",
  validate(z.object({ body: submitScreeningSchema })),
  asyncHandler(screeningController.submit),
);
router.get("/", asyncHandler(screeningController.getScreenings));
router.get(
  "/:id",
  validate(z.object({ params: idParamSchema })),
  asyncHandler(screeningController.getScreeningById),
);

export default router;
