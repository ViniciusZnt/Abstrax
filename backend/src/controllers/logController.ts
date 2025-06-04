import { Response, NextFunction } from "express";
import { logService, EntityType } from "../services/logService";

export const getUserLogs = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    const logs = await logService.getUserLogs(userId);
    res.json(logs);
  } catch (error: any) {
    next(error);
  }
};

export const getEntityLogs = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { entityType, entityId } = req.params;
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    // Verifica se o tipo de entidade é válido
    if (!Object.values(EntityType).includes(entityType as EntityType)) {
      res.status(400).json({ error: "Tipo de entidade inválido" });
      return;
    }

    const logs = await logService.getEntityLogs(entityType as EntityType, entityId);
    res.json(logs);
  } catch (error: any) {
    next(error);
  }
}; 