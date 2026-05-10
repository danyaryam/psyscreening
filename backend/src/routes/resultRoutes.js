import { Router } from "express";
import * as resultController from "../controllers/resultController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// GET - Ambil semua hasil screening
router.get("/", asyncHandler(resultController.getAllResults));

// GET - Ambil hasil screening by ID
router.get("/:id", asyncHandler(resultController.getResultById));

// POST - Buat hasil screening baru
router.post("/", asyncHandler(resultController.createResult));

export default router;
