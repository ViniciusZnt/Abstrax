import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secreta";

interface CustomJwtPayload extends jwt.JwtPayload {
  userId: string;
}

export const authenticate = (
  req: Request & { userId?: string },
  res: Response,
  next: NextFunction
): void => {
  // Agora pegando o token do body em vez do header
  const token = req.body.token;

  if (!token) {
    res.status(401).json({ error: "Token ausente no body da requisição" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
    req.userId = decoded.userId;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ error: "Token expirado" });
    } else if (err instanceof jwt.JsonWebTokenError) {
      console.log("Token recebido:", token);
      console.log("JWT_SECRET:", JWT_SECRET);
      res.status(401).json({ error: "Token inválido" });
    } else {
      res.status(500).json({ error: "Erro na autenticação" });
    }
  }
};
