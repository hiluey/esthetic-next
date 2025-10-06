import { PrismaClient } from "@prisma/client";

declare global {
  // Impede recriar o client a cada hot reload em dev
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ["query"], // opcional
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
