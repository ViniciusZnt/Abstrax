import { Request, Response } from 'express';
import { register, login } from '@/controllers/authController';
import { authService } from '@/services/authService';

// Mock do authService
jest.mock('@/services/authService', () => ({
  authService: {
    register: jest.fn(),
    login: jest.fn(),
  },
}));

describe('AuthController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };
    mockRequest = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      },
    };
  });

  describe('register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      };

      (authService.register as jest.Mock).mockResolvedValue(mockUser);

      await register(mockRequest as Request, mockResponse as Response);

      expect(authService.register).toHaveBeenCalledWith(
        'Test User',
        'test@example.com',
        'password123'
      );
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockUser);
    });

    it('deve retornar erro 400 quando o registro falha', async () => {
      const errorMessage = 'Email já existe';
      (authService.register as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await register(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe('login', () => {
    it('deve fazer login com sucesso', async () => {
      const mockLoginResponse = {
        token: 'jwt-token',
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
        },
      };

      (authService.login as jest.Mock).mockResolvedValue(mockLoginResponse);

      await login(mockRequest as Request, mockResponse as Response);

      expect(authService.login).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
      expect(mockJson).toHaveBeenCalledWith(mockLoginResponse);
    });

    it('deve retornar erro 401 quando o login falha', async () => {
      const errorMessage = 'Credenciais inválidas';
      (authService.login as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await login(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
}); 