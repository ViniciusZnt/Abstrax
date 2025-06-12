import { Request, Response, NextFunction } from "express";
import { artService } from "../services/artService";

export const createArt = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { name, description, isPublic, tags, metadata } = req.body;
    const userId = req.userId;
    const file = req.file;

    if (!userId) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    // Criar a arte primeiro
    const art = await artService.createArt({
      name,
      description,
      isPublic: isPublic === 'true',
      creatorId: userId,
      tags: tags ? JSON.parse(tags) : [],
      metadata: metadata ? JSON.parse(metadata) : {},
    });

    // Se tiver imagem, atualizar a arte com a imagem
    if (file) {
      const updatedArt = await artService.updateArtImage(
        art.id,
        file.buffer,
        file.mimetype,
        userId
      );
      res.status(201).json(updatedArt);
    } else {
      res.status(201).json(art);
    }
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

    console.log('Recebendo upload de imagem:', {
      artId: id,
      userId,
      mimeType: file.mimetype,
      size: file.size
    });

    const art = await artService.updateArtImage(
      id,
      file.buffer,
      file.mimetype,
      userId
    );

    console.log('Imagem salva com sucesso:', {
      artId: id,
      hasImageData: !!art.imageData,
      mimeType: art.mimeType
    });
    
    res.json(art);
  } catch (error: any) {
    console.error('Erro no upload de imagem:', error);
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

    console.log('Buscando imagem:', { artId: id, userId });

    const art = await artService.getArt(id, userId);
    
    if (!art) {
      console.log('Arte não encontrada:', { artId: id });
      res.status(404).json({ error: "Arte não encontrada" });
      return;
    }

    if (!art.imageData || !art.mimeType) {
      console.log('Imagem não encontrada:', { artId: id, hasImageData: !!art.imageData, mimeType: art.mimeType });
      res.status(404).json({ error: "Imagem não encontrada" });
      return;
    }

    console.log('Enviando imagem:', {
      artId: id,
      mimeType: art.mimeType,
      imageSize: art.imageData.length
    });

    // Configurar cabeçalhos de segurança e cache
    res.setHeader('Content-Type', art.mimeType);
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Cache-Control', 'no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.removeHeader('Content-Security-Policy');
    res.removeHeader('X-Frame-Options');
    
    // Enviar a imagem como buffer
    res.end(art.imageData);
  } catch (error: any) {
    console.error('Erro ao buscar imagem:', error);
    next(error);
  }
};