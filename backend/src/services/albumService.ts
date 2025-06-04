import prisma from "../utils/prisma";
import { logService, ActionType, EntityType } from "./logService";

interface CreateAlbumData {
  title: string;
  description?: string;
  imageUrl?: string;
  tags?: any;
  creatorId: string;
}

interface UpdateAlbumData {
  title?: string;
  description?: string;
  imageUrl?: string;
  tags?: any;
  userId: string;
}

export const albumService = {
  async createAlbum(data: CreateAlbumData) {
    const album = await prisma.album.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        tags: data.tags,
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
      entityType: EntityType.ALBUM,
      entityId: album.id,
      userId: data.creatorId,
      albumId: album.id,
      details: {
        title: album.title,
        tags: album.tags,
      },
    });

    return album;
  },

  async getAlbum(id: string, userId: string) {
    const album = await prisma.album.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        arts: true,
      },
    });

    if (!album) {
      return null;
    }

    // Verifica se o usuário tem permissão para ver o álbum
    if (album.creatorId !== userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (user?.role !== "admin") {
        throw new Error("Não autorizado");
      }
    }

    return album;
  },

  async updateAlbum(id: string, data: UpdateAlbumData) {
    const album = await prisma.album.findUnique({
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

    if (!album) {
      throw new Error("Álbum não encontrado");
    }

    // Verifica se o usuário tem permissão para atualizar
    if (album.creatorId !== data.userId) {
      const user = await prisma.user.findUnique({
        where: { id: data.userId },
        select: { role: true },
      });

      if (user?.role !== "admin") {
        throw new Error("Não autorizado");
      }
    }

    const updatedAlbum = await prisma.album.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        tags: data.tags,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        arts: true,
      },
    });

    // Registra a atualização no log
    await logService.createLog({
      action: ActionType.UPDATE,
      entityType: EntityType.ALBUM,
      entityId: updatedAlbum.id,
      userId: data.userId,
      albumId: updatedAlbum.id,
      details: {
        title: updatedAlbum.title,
        updatedFields: Object.keys(data),
      },
    });

    return updatedAlbum;
  },

  async deleteAlbum(id: string, userId: string) {
    const album = await prisma.album.findUnique({
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

    if (!album) {
      throw new Error("Álbum não encontrado");
    }

    // Verifica se o usuário tem permissão para deletar
    if (album.creatorId !== userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (user?.role !== "admin") {
        throw new Error("Não autorizado");
      }
    }

    // Remove todas as artes do álbum antes de deletá-lo
    await prisma.art.updateMany({
      where: { albumId: id },
      data: { albumId: null },
    });

    await prisma.album.delete({
      where: { id },
    });

    // Registra a deleção no log
    await logService.createLog({
      action: ActionType.DELETE,
      entityType: EntityType.ALBUM,
      entityId: id,
      userId: userId,
      details: {
        title: album.title,
      },
    });
  },

  async getUserAlbums(userId: string) {
    return prisma.album.findMany({
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
        arts: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async moveArtToAlbum(artId: string, albumId: string | null, userId: string) {
    const art = await prisma.art.findUnique({
      where: { id: artId },
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

    // Verifica se o usuário tem permissão para mover a arte
    if (art.creatorId !== userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (user?.role !== "admin") {
        throw new Error("Não autorizado");
      }
    }

    // Se albumId for fornecido, verifica se o álbum existe e pertence ao usuário
    if (albumId) {
      const album = await prisma.album.findUnique({
        where: { id: albumId },
      });

      if (!album) {
        throw new Error("Álbum não encontrado");
      }

      if (album.creatorId !== userId) {
        throw new Error("Não autorizado a mover para este álbum");
      }
    }

    const updatedArt = await prisma.art.update({
      where: { id: artId },
      data: { albumId },
      include: {
        album: true,
      },
    });

    // Registra a movimentação no log
    await logService.createLog({
      action: ActionType.MOVE,
      entityType: EntityType.ART,
      entityId: updatedArt.id,
      userId: userId,
      artId: updatedArt.id,
      albumId: updatedArt.albumId,
      details: {
        artName: updatedArt.name,
        toAlbum: updatedArt.album?.title || "Removido do álbum",
      },
    });

    return updatedArt;
  },

  async getAlbumArts(albumId: string, userId: string) {
    const album = await prisma.album.findUnique({
      where: { id: albumId },
      include: {
        creator: {
          select: {
            id: true,
            role: true,
          },
        },
      },
    });

    if (!album) {
      throw new Error("Álbum não encontrado");
    }

    // Verifica se o usuário tem permissão para ver o álbum
    if (album.creatorId !== userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (user?.role !== "admin") {
        throw new Error("Não autorizado");
      }
    }

    // Busca todas as artes do álbum
    return prisma.art.findMany({
      where: { albumId },
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
}; 