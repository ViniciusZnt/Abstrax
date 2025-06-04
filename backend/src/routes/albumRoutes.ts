import express from "express";
import { createAlbum, getAlbum, updateAlbum, deleteAlbum, getUserAlbums, moveArtToAlbum, getAlbumArts } from "../controllers/albumController";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Criar um novo álbum
router.post("/", createAlbum);

// Obter um álbum específico
router.get("/:id", getAlbum);

// Obter todas as artes de um álbum
router.get("/:id/arts", getAlbumArts);

// Atualizar um álbum
router.put("/:id", updateAlbum);

// Deletar um álbum
router.delete("/:id", deleteAlbum);

// Obter todos os álbuns do usuário
router.get("/user/albums", getUserAlbums);

// Mover uma arte para um álbum
router.post("/art/:artId/move", moveArtToAlbum);

export default router; 