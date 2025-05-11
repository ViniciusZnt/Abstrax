import { Router } from "express";
import prisma from "../utils/prisma";

const router = Router();

router.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "online",
      database: "connected",
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    res.status(500).json({
      status: "degraded",
      database: "disconnected",
      error: "Erro ao conectar ao banco de dados",
      timestamp: new Date(),
    });
  }
});

export default router;
