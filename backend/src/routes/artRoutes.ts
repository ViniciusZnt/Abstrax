import { Router } from "express";
import { authenticate } from "../middleware/auth";
import upload from "../middleware/upload";
import {
  createArt,
  getArt,
  updateArt,
  deleteArt,
  getUserArts,
  uploadImage,
  getArtImage,
  toggleVisibility,
  getPublicArts,
  getPublicArtImage,
} from "../controllers/artController";

const router = Router();

// Rotas públicas (sem autenticação)
router.get("/public", getPublicArts);
router.get("/:id/image/public", getPublicArtImage);

// Rotas protegidas por autenticação
router.use(authenticate);

// Rotas de arte
router.post("/", upload.single("image"), createArt);
router.get("/user/arts", getUserArts);
router.get("/:id", getArt);
router.put("/:id", updateArt);
router.delete("/:id", deleteArt);

// Alternar visibilidade
router.patch("/:id/visibility", toggleVisibility);

// Rotas de imagem
router.post("/:id/image", upload.single("image"), uploadImage);
router.get("/:id/image", getArtImage);

export default router; 