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
  let token: string | undefined;

  // Primeiro tenta pegar o token do header de autorização
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
      token = parts[1];
    }
  }

  // Se não encontrou no header, tenta pegar da query string
  if (!token && req.query.token) {
    token = req.query.token as string;
  }

  // Se não encontrou o token em nenhum lugar
  if (!token) {
    res.status(401).json({ error: "Token de autorização não fornecido" });
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
