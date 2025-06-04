import express from "express";
import { createArt, getArt, updateArt, deleteArt, getUserArts } from "../controllers/artController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Criar uma nova arte
router.post("/", createArt);

// Obter uma arte específica
router.get("/:id", getArt);

// Atualizar uma arte
router.put("/:id", updateArt);

// Deletar uma arte
router.delete("/:id", deleteArt);

// Obter todas as artes do usuário
router.get("/user", getUserArts);

export default router; 