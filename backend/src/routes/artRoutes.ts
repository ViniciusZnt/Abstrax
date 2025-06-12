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
} from "../controllers/artController";

const router = Router();

// Rotas protegidas por autenticação
router.use(authenticate);

// Rotas de arte
router.post("/", upload.single("image"), createArt);
router.get("/user/arts", getUserArts);
router.get("/:id", getArt);
router.put("/:id", updateArt);
router.delete("/:id", deleteArt);

// Rotas de imagem
router.post("/:id/image", upload.single("image"), uploadImage);
router.get("/:id/image", getArtImage);

export default router; 