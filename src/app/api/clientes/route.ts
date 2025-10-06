import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { PrismaClient } = await import("@prisma/client"); 
    const prisma = new PrismaClient();

    const clientes = await prisma.clientes.findMany();
    return NextResponse.json(clientes);
  } catch (error: any) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json(
      { error: "Erro ao buscar clientes", detalhes: error.message },
      { status: 500 }
    );
  }
}
