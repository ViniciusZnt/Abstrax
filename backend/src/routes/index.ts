import { Router } from "express";
import homeRoute from "./homeRoute";
import healthCheckRoute from "./healthCheckRoute";
import authRoutes from "./authRoute";
import artRoutes from "./artRoutes";
import albumRoutes from "./albumRoutes";
import logRoutes from "./logRoutes";
import userRoutes from "./userRoutes";

const router = Router();

router.use("/", homeRoute);
router.use("/", healthCheckRoute);
router.use("/api/auth", authRoutes);
router.use("/api/arts", artRoutes);
router.use("/api/albums", albumRoutes);
router.use("/api/logs", logRoutes);
router.use("/api/users", userRoutes);

export default router;
