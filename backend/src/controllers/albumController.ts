import { Response, NextFunction } from "express";
import { albumService } from "../services/albumService";

export const createAlbum = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { title, description, imageUrl, tags } = req.body;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const album = await albumService.createAlbum({
      title,
      description,
      imageUrl,
      tags,
      creatorId: userId,
    });

    res.status(201).json(album);
  } catch (error: any) {
    next(error);
  }
};

export const getAlbum = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const album = await albumService.getAlbum(id, userId);
    
    if (!album) {
      res.status(404).json({ error: "Álbum não encontrado" });
      return;
    }

    res.json(album);
  } catch (error: any) {
    if (error.message === "Não autorizado") {
      res.status(403).json({ error: error.message });
      return;
    }
    next(error);
  }
};

export const updateAlbum = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, tags } = req.body;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const album = await albumService.updateAlbum(id, {
      title,
      description,
      imageUrl,
      tags,
      userId,
    });

    res.json(album);
  } catch (error: any) {
    if (error.message === "Não autorizado") {
      res.status(403).json({ error: error.message });
      return;
    }
    next(error);
  }
};

export const deleteAlbum = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    await albumService.deleteAlbum(id, userId);
    res.status(200).json({ message: "Álbum deletado com sucesso" });
  } catch (error: any) {
    if (error.message === "Não autorizado") {
      res.status(403).json({ error: error.message });
      return;
    }
    next(error);
  }
};

export const getUserAlbums = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const albums = await albumService.getUserAlbums(userId);
    res.json(albums);
  } catch (error: any) {
    next(error);
  }
};

export const moveArtToAlbum = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { artId } = req.params;
    const { albumId } = req.body;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const art = await albumService.moveArtToAlbum(artId, albumId, userId);
    res.json(art);
  } catch (error: any) {
    if (error.message.includes("Não autorizado")) {
      res.status(403).json({ error: error.message });
      return;
    }
    if (error.message.includes("não encontrad")) {
      res.status(404).json({ error: error.message });
      return;
    }
    next(error);
  }
};

export const getAlbumArts = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const arts = await albumService.getAlbumArts(id, userId);
    res.json(arts);
  } catch (error: any) {
    if (error.message === "Não autorizado") {
      res.status(403).json({ error: error.message });
      return;
    }
    if (error.message === "Álbum não encontrado") {
      res.status(404).json({ error: error.message });
      return;
    }
    next(error);
  }
}; 