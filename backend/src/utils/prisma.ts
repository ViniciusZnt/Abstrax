import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Conexão e desconexão do Prisma
export const connectPrisma = async () => {
  await prisma.$connect();
};

export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};

export default prisma;
