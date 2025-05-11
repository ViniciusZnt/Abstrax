import { ErrorRequestHandler, Request, Response, NextFunction } from "express";

interface ErrorResponse {
  error: string;
  message?: string;
  stack?: string;
}

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Erro:", err);

  const response: ErrorResponse = {
    error: "Erro interno do servidor",
  };

  if (process.env.NODE_ENV === "development") {
    response.message = err.message;
    response.stack = err.stack;
  }

  res.status(500).json(response);
};
