import { Request, Response, NextFunction } from "express";
import { artService } from "../services/artService";

export const createArt = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { name, description, isPublic } = req.body;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const art = await artService.createArt({
      name,
      description,
      isPublic,
      creatorId: userId,
    });

    res.status(201).json(art);
  } catch (error: any) {
    next(error);
  }
};

export const getArt = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const art = await artService.getArt(id, userId);
    
    if (!art) {
      res.status(404).json({ error: "Arte não encontrada" });
      return;
    }

    res.json(art);
  } catch (error: any) {
    next(error);
  }
};

export const updateArt = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, isPublic } = req.body;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const art = await artService.updateArt(id, {
      name,
      description,
      isPublic,
      userId,
    });

    res.json(art);
  } catch (error: any) {
    if (error.message === "Não autorizado") {
      res.status(403).json({ error: error.message });
      return;
    }
    next(error);
  }
};

export const deleteArt = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    await artService.deleteArt(id, userId);
    res.status(200).json({ message: "Arte deletada com sucesso" });
  } catch (error: any) {
    if (error.message === "Não autorizado") {
      res.status(403).json({ error: error.message });
      return;
    }
    next(error);
  }
};

export const getUserArts = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const arts = await artService.getUserArts(userId);
    res.json(arts);
  } catch (error: any) {
    next(error);
  }
}; 

// src/controllers/artController.ts
export const uploadImage = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const file = req.file;

    if (!userId) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    if (!file) {
      res.status(400).json({ error: "Nenhuma imagem enviada" });
      return;
    }

    const art = await artService.updateArtImage(
      id,
      file.buffer,
      file.mimetype,
      userId
    );
    
    res.json(art);
  } catch (error: any) {
    next(error);
  }
};

export const getArtImage = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const art = await artService.getArt(id, userId);
    
    if (!art) {
      res.status(404).json({ error: "Arte não encontrada" });
      return;
    }

    if (!art.imageData || !art.mimeType) {
      res.status(404).json({ error: "Imagem não encontrada" });
      return;
    }

    res.setHeader('Content-Type', art.mimeType);
    res.send(art.imageData);
  } catch (error: any) {
    next(error);
  }
};