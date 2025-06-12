import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import dotenv from "dotenv";

// Inicializa variáveis de ambiente
dotenv.config();

const app = express();

// Middlewares globais
app.use(express.json());

// Lista de origens permitidas
const allowedOrigins = [
  'http://localhost:3000',  // Next.js dev server
  'http://127.0.0.1:3000',  // Alternativa para localhost
  process.env.FRONTEND_URL  // URL de produção (se configurada)
].filter(Boolean); // Remove valores undefined/null

// Configuração do CORS
app.use(cors({
  origin: (origin, callback) => {
    // Permite requisições sem origin (como mobile apps ou curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
}));

// Configuração do Helmet com exceções para imagens
app.use(helmet({
  crossOriginResourcePolicy: {
    policy: "cross-origin"
  },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "*"],
      connectSrc: ["'self'", "http://localhost:3000", "http://127.0.0.1:3000"]
    }
  }
}));

// Rotas
app.use(routes);

// Middleware de tratamento de erros
app.use(errorHandler);

export default app;
