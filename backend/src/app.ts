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
app.use(cors());
app.use(helmet());

// Rotas
app.use(routes);

// Middleware de tratamento de erros
app.use(errorHandler);

export default app;
