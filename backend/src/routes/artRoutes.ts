import express from "express";
import { createArt, getArt, updateArt, deleteArt, getUserArts, uploadImage, getArtImage } from "../controllers/artController";
import { authenticate } from "../middleware/auth";
import upload from "../middleware/upload";

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Criar uma nova arte
router.post("/", createArt);

// Obter uma arte específica
router.get("/:id", getArt);

// Obter a imagem de uma arte específica
router.get("/:id/image", getArtImage);

// Atualizar uma arte
router.put("/:id", updateArt);

// Deletar uma arte
router.delete("/:id", deleteArt);

// Obter todas as artes do usuário
router.get("/user/arts", getUserArts);

// Upload de imagem para uma arte
router.post("/:id/image", upload.single("image"), uploadImage);

export default router; 