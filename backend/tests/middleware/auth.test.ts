import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from '@/middleware/auth';
import config from '@/config/config';

jest.mock('jsonwebtoken');
jest.mock('@/config/config', () => ({
  default: {
    jwtSecret: 'secreta'
  }
}));

interface RequestWithUser extends Request {
  user?: { id: number; email: string };
}

describe('Middleware de Autenticação', () => {
  let mockRequest: Partial<RequestWithUser>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  it('deve retornar erro 401 quando não há token', async () => {
    await authenticate(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Token ausente no body da requisição',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('deve retornar erro 500 quando o token é inválido', async () => {
    mockRequest.body = {
      token: 'token-invalido',
    };

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Token inválido');
    });

    await authenticate(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Erro na autenticação',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('deve chamar next() quando o token é válido', async () => {
    const mockUser = { id: 1, email: 'test@example.com' };
    mockRequest.body = {
      token: 'token-valido',
    };

    (jwt.verify as jest.Mock).mockReturnValue(mockUser);

    await authenticate(
      mockRequest as RequestWithUser,
      mockResponse as Response,
      mockNext
    );

    expect(jwt.verify).toHaveBeenCalledWith('token-valido', 'secreta');
    expect(mockNext).toHaveBeenCalled();
  });
}); 