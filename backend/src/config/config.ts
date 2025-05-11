import dotenv from "dotenv";

// Carregar variáveis de ambiente
dotenv.config();

export default {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || "sua_chave_secreta_jwt",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
};
