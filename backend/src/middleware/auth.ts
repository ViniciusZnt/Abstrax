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
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "Token de autorização não fornecido" });
    return;
  }

  // Formato esperado: "Bearer token"
  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    res.status(401).json({ error: "Token mal formatado" });
    return;
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    res.status(401).json({ error: "Token mal formatado" });
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
      res.status(401).json({ error: "Token inválido" });
    } else {
      res.status(500).json({ error: "Erro na autenticação" });
    }
  }
};
