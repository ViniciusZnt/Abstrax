import express from "express";
import { getUserLogs, getEntityLogs } from "../controllers/logController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Obter logs do usuário
router.get("/user", getUserLogs);

// Obter logs de uma entidade específica
router.get("/:entityType/:entityId", getEntityLogs);

export default router; 