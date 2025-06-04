import { Router } from "express";
import homeRoute from "./homeRoute";
import healthCheckRoute from "./healthCheckRoute";
import authRoutes from "./authRoute";
import artRoutes from "./artRoutes";
import albumRoutes from "./albumRoutes";
import logRoutes from "./logRoutes";

const router = Router();

router.use("/", homeRoute);
router.use("/", healthCheckRoute);
router.use("/api/auth", authRoutes);
router.use("/api/arts", artRoutes);
router.use("/api/albums", albumRoutes);
router.use("/api/logs", logRoutes);

export default router;
