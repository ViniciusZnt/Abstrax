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

    if (!name || name.trim() === '') {
      res.status(400).json({ error: "Nome da arte é obrigatório" });
      return;
    }

    console.log('Criando arte:', {
      name,
      description,
      isPublic,
      hasFile: !!file,
      userId,
      tags,
      metadata
    });

    // Parse seguro de tags
    let parsedTags = [];
    if (tags) {
      try {
        if (typeof tags === 'string') {
          parsedTags = JSON.parse(tags);
        } else if (Array.isArray(tags)) {
          parsedTags = tags;
        }
      } catch (error) {
        console.warn('Erro ao fazer parse de tags:', tags, error);
        // Se o parse falhar, tenta tratar como string simples
        parsedTags = typeof tags === 'string' ? [tags] : [];
      }
    }

    // Parse seguro de metadata
    let parsedMetadata = {};
    if (metadata) {
      try {
        if (typeof metadata === 'string') {
          parsedMetadata = JSON.parse(metadata);
        } else if (typeof metadata === 'object') {
          parsedMetadata = metadata;
        }
      } catch (error) {
        console.warn('Erro ao fazer parse de metadata:', metadata, error);
        // Se o parse falhar, usa objeto vazio
        parsedMetadata = {};
      }
    }

    // Criar a arte primeiro
    const art = await artService.createArt({
      name: name.trim(),
      description: description?.trim() || '',
      isPublic: isPublic === 'true' || isPublic === true,
      creatorId: userId,
      tags: parsedTags,
      metadata: parsedMetadata,
    });

    console.log('Arte criada:', { artId: art.id });

    // Se tiver imagem, atualizar a arte com a imagem
    if (file) {
      console.log('Processando imagem:', {
        artId: art.id,
        mimeType: file.mimetype,
        size: file.size
      });

      const updatedArt = await artService.updateArtImage(
        art.id,
        file.buffer,
        file.mimetype,
        userId
      );
      
      console.log('Arte atualizada com imagem:', { artId: updatedArt.id });
      res.status(201).json(updatedArt);
    } else {
      console.log('Arte criada sem imagem:', { artId: art.id });
      res.status(201).json(art);
    }
  } catch (error: any) {
    console.error('Erro ao criar arte:', error);
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

    if (!id || id.trim() === '') {
      res.status(400).json({ error: "ID da arte é obrigatório" });
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
    
    res.status(200).json(art);
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

    // Configurar cabeçalhos para melhor compatibilidade com CORS
    res.setHeader('Content-Type', art.mimeType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
    res.setHeader('Content-Length', art.imageData.length.toString());
    
    // Cache headers - permitir cache da imagem
    res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hora de cache
    res.setHeader('ETag', `"${art.id}-${art.updatedAt?.getTime()}"`);
    
    // Verificar If-None-Match para cache condicional
    const ifNoneMatch = req.headers['if-none-match'];
    const etag = `"${art.id}-${art.updatedAt?.getTime()}"`;
    
    if (ifNoneMatch === etag) {
      res.status(304).end();
      return;
    }
    
    // Enviar a imagem como buffer
    res.end(art.imageData);
  } catch (error: any) {
    console.error('Erro ao buscar imagem:', error);
    next(error);
  }
};