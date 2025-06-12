import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "secreta";

export const authService = {
  async register(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return { id: user.id, name: user.name, email: user.email };
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Usuário não encontrado");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Senha inválida");

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return { token, user: { id: user.id, name: user.name, email: user.email } };
  },

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        arts: { select: { id: true } },
        albums: { select: { id: true } },
        actions: { select: { id: true } },
      },
    });

    if (!user) throw new Error("Perfil do usuário não encontrado");

    // Calcular totalArts, totalAlbums, totalLikes (exemplo, você pode ter um campo dedicado para likes)
    const totalArts = user.arts.length;
    const totalAlbums = user.albums.length;
    // Supondo que 'actions' pode ser usado para calcular 'likes' ou outra métrica
    const totalLikes = user.actions.length; // Isso é um placeholder, ajuste conforme sua lógica de likes

    // Remover password do retorno e campos que não queremos expor
    const { password, arts, albums, actions, ...userProfile } = user;

    return { 
      ...userProfile, 
      totalArts, 
      totalAlbums, 
      totalLikes
    };
  },

  async updateProfile(userId: string, data: { name?: string; bio?: string; website?: string; socialLinks?: any }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: data,
      include: {
        arts: { select: { id: true } },
        albums: { select: { id: true } },
        actions: { select: { id: true } },
      },
    });

    if (!user) throw new Error("Usuário não encontrado para atualização");

    const totalArts = user.arts.length;
    const totalAlbums = user.albums.length;
    const totalLikes = user.actions.length; // Placeholder

    // Remover password do retorno e campos que não queremos expor
    const { password, arts, albums, actions, ...userProfile } = user;

    return { 
      ...userProfile, 
      totalArts, 
      totalAlbums, 
      totalLikes
    };
  },

  async updatePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("Usuário não encontrado");

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) throw new Error("Senha atual inválida");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: "Senha atualizada com sucesso" };
  },
};


