import { Router } from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import screeningRoutes from "./screeningRoutes.js";
import adminRoutes from "./adminRoutes.js";
import resultRoutes from "./resultRoutes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "psyscreening-api",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/screenings", screeningRoutes);
router.use("/admin", adminRoutes);
router.use("/results", resultRoutes);

export default router;
