import app from "./app";
import config from "./config/config";
import { connectPrisma, disconnectPrisma } from "./utils/prisma";

const PORT = process.env.PORT || 4000;

// Inicializa o servidor
const server = app.listen(PORT, async () => {
  try {
    await connectPrisma();
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Ambiente: ${config.nodeEnv}`);
  } catch (error) {
    console.error("Falha ao iniciar o servidor:", error);
    process.exit(1);
  }
});

// Lidar com desligamento gracioso
process.on("SIGTERM", async () => {
  await disconnectPrisma();
  server.close(() => {
    console.log("Servidor encerrado");
  });
});

process.on("SIGINT", async () => {
  await disconnectPrisma();
  server.close(() => {
    console.log("Servidor encerrado");
  });
});
