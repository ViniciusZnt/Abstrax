import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const user = await authService.getProfile(userId);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { name, bio, website, socialLinks } = req.body;
    const user = await authService.updateProfile(userId, { name, bio, website, socialLinks });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).userId;
    const { currentPassword, newPassword } = req.body;
    const result = await authService.updatePassword(userId, currentPassword, newPassword);
    res.json(result);
  } catch (error) {
    next(error);
  }
}; 