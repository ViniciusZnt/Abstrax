import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

declare namespace Express {
  export interface Request {
    userId?: string;
  }
}

export {}; 