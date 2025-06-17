import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import multer from "multer";

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

  // Verificar se já foi enviada uma resposta
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = 500;
  let errorMessage = "Erro interno do servidor";

  // Tratamento específico para erros do Multer
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        errorMessage = 'Arquivo muito grande. Tamanho máximo permitido: 5MB';
        break;
      case 'LIMIT_FILE_COUNT':
        errorMessage = 'Muitos arquivos enviados';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        errorMessage = 'Campo de arquivo inesperado';
        break;
      default:
        errorMessage = 'Erro no upload do arquivo';
    }
  } else if (err.message === 'Apenas imagens JPEG e PNG são permitidas') {
    statusCode = 400;
    errorMessage = err.message;
  } else if (err.message.includes('Não autorizado')) {
    statusCode = 403;
    errorMessage = err.message;
  } else if (err.message.includes('não encontrado')) {
    statusCode = 404;
    errorMessage = err.message;
  } else if (err.message) {
    statusCode = 400;
    errorMessage = err.message;
  }

  const response: ErrorResponse = {
    error: errorMessage,
  };

  if (process.env.NODE_ENV === "development") {
    response.message = err.message;
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
