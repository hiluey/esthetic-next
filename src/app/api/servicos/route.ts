import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const servicos = await prisma.servicos.findMany({
    select: {
      id: true,
      nome: true,
    },
  });
  return NextResponse.json(servicos);
}