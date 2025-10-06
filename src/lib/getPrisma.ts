// src/lib/getPrisma.ts
export async function getPrisma() {
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient({
    log: ["query"], // opcional
  });
}
