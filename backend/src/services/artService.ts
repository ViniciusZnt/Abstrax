import prisma from "../utils/prisma";
import { logService, ActionType, EntityType } from "./logService";
import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();

interface CreateArtData {
  name: string;
  description?: string;
  isPublic: boolean;
  creatorId: string;
  metadata?: any;
  tags?: string[];
}

interface UpdateArtData {
  name?: string;
  description?: string;
  isPublic?: boolean;
  userId: string;
  metadata?: any;
  tags?: string[];
}

export const artService = {
  async createArt(data: CreateArtData) {
    const art = await prisma.art.create({
      data: {
        name: data.name,
        description: data.description,
        isPublic: data.isPublic,
        creatorId: data.creatorId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Registra a criação no log
    await logService.createLog({
      action: ActionType.CREATE,
      entityType: EntityType.ART,
      entityId: art.id,
      userId: data.creatorId,
      artId: art.id,
      details: {
        name: art.name,
        isPublic: art.isPublic,
      },
    });

    return art;
  },

  async getArt(id: string, userId: string) {
    const art = await prisma.art.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    if (!art) {
      return null;
    }

    // Verifica se o usuário tem permissão para ver a arte
    if (!art.isPublic && art.creatorId !== userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (user?.role !== "admin") {
        throw new Error("Não autorizado");
      }
    }

    return art;
  },

  async updateArt(id: string, data: UpdateArtData) {
    const art = await prisma.art.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            role: true,
          },
        },
      },
    });

    if (!art) {
      throw new Error("Arte não encontrada");
    }

    // Verifica se o usuário tem permissão para atualizar
    if (art.creatorId !== data.userId) {
      const user = await prisma.user.findUnique({
        where: { id: data.userId },
        select: { role: true },
      });

      if (user?.role !== "admin") {
        throw new Error("Não autorizado");
      }
    }

    const updatedArt = await prisma.art.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        isPublic: data.isPublic,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Registra a atualização no log
    await logService.createLog({
      action: ActionType.UPDATE,
      entityType: EntityType.ART,
      entityId: updatedArt.id,
      userId: data.userId,
      artId: updatedArt.id,
      details: {
        name: updatedArt.name,
        isPublic: updatedArt.isPublic,
        updatedFields: Object.keys(data),
      },
    });

    return updatedArt;
  },

  async deleteArt(id: string, userId: string) {
    const art = await prisma.art.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            role: true,
          },
        },
      },
    });

    if (!art) {
      throw new Error("Arte não encontrada");
    }

    // Verifica se o usuário tem permissão para deletar
    if (art.creatorId !== userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (user?.role !== "admin") {
        throw new Error("Não autorizado");
      }
    }

    const deletedArt = await prisma.art.delete({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Registra a deleção no log
    await logService.createLog({
      action: ActionType.DELETE,
      entityType: EntityType.ART,
      entityId: id,
      userId: userId,
      details: {
        name: deletedArt.name,
      },
    });

    return deletedArt;
  },

  async getUserArts(userId: string) {
    return prisma.art.findMany({
      where: {
        creatorId: userId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async updateArtImage(id: string, imageBuffer: Buffer, mimeType: string, userId: string) {
    // Verificar se a arte existe e pertence ao usuário
    const art = await prismaClient.art.findFirst({
      where: {
        id,
        creatorId: userId,
      },
    });

    if (!art) {
      throw new Error("Arte não encontrada ou não autorizado");
    }

    // Atualizar a arte com a nova imagem
    return prismaClient.art.update({
      where: { id },
      data: {
        imageData: imageBuffer,
        mimeType: mimeType,
        updatedAt: new Date(),
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },
}; 