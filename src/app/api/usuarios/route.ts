import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const colaboradores = await prisma.usuarios.findMany({
    where: { tipo: "colaborador" },
    select: {
      id: true,
      nome: true,
    },
  });
  return NextResponse.json(colaboradores);
}
