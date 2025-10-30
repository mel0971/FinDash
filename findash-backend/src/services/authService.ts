import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateToken, generateRefreshToken } from "../utils/jwt";

const prisma = new PrismaClient();

export const authService = {
  async register(email: string, password: string, name: string, username: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, username, passwordHash: hashedPassword, name },
    });

    const token = generateToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    return { user: { id: user.id, email: user.email, name: user.name }, token, refreshToken };
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) throw new Error("Invalid password");

    const token = generateToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    return { user: { id: user.id, email: user.email, name: user.name }, token, refreshToken };
  },
};
