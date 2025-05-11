import { Router } from "express";
import homeRoute from "./homeRoute";
import healthCheckRoute from "./healthCheckRoute";
import authRoutes from "./authRoute";

const router = Router();

router.use("/", homeRoute);
router.use("/", healthCheckRoute);
router.use("/api/auth", authRoutes);

export default router;
