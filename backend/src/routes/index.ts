import { Router } from "express";
import homeRoute from "./homeRoute";
import healthCheckRoute from "./healthCheckRoute";

const router = Router();

router.use("/", homeRoute);
router.use("/", healthCheckRoute);

export default router;
