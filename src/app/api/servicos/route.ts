import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startTelemetry } from "@/lib/otel-setup";

startTelemetry().catch((err) =>
  console.error("Erro iniciando telemetry:", err)
);

// POST /api/servicos - Criar novo serviço
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nome, descricao, preco } = body;

    // Validações básicas
    if (!nome || preco === undefined) {
      return NextResponse.json(
        { error: "Nome e preço são obrigatórios." },
        { status: 400 }
      );
    }

    // Como preco é Decimal no Prisma, é melhor converter para string antes de passar
    // Ou usar um string para evitar problema com JSON e Decimal
    const precoDecimal = typeof preco === "string" ? preco : preco.toString();

    const novoServico = await prisma.servicos.create({
      data: {
        nome,
        descricao,
        preco,
      },
    });

    return NextResponse.json(novoServico, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar serviço:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar serviço." },
      { status: 500 }
    );
  }
}

// GET /api/servicos - Listar serviços
export async function GET(req: NextRequest) {
  try {
    const servicos = await prisma.servicos.findMany({
      orderBy: { nome: "asc" },
    });
    return NextResponse.json(servicos, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    return NextResponse.json(
      { error: "Erro ao buscar serviços." },
      { status: 500 }
    );
  }
}
