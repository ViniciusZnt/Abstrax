import prisma from "../utils/prisma";

export enum ActionType {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  MOVE = "MOVE"
}

export enum EntityType {
  ART = "ART",
  ALBUM = "ALBUM"
}

interface CreateLogData {
  action: ActionType;
  entityType: EntityType;
  entityId: string;
  userId: string;
  details?: any;
  artId?: string | null;
  albumId?: string | null;
}

export const logService = {
  async createLog(data: CreateLogData) {
    return prisma.actionLog.create({
      data: {
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        details: data.details,
        userId: data.userId,
        artId: data.artId,
        albumId: data.albumId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        art: {
          select: {
            id: true,
            name: true,
          },
        },
        album: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  },

  async getUserLogs(userId: string) {
    return prisma.actionLog.findMany({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        art: {
          select: {
            id: true,
            name: true,
          },
        },
        album: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async getEntityLogs(entityType: EntityType, entityId: string) {
    return prisma.actionLog.findMany({
      where: {
        entityType,
        entityId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        art: {
          select: {
            id: true,
            name: true,
          },
        },
        album: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
}; 