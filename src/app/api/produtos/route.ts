import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const produtos = await prisma.produtos.findMany({
    orderBy: { nome: "asc" },
    
    select: {
      nome: true,
      categoria: true,
      preco: true,
      estoque: true,
      status: true,
    },
  });

  return NextResponse.json(produtos);
}