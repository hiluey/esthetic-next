import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startTelemetry } from "@/lib/otel-setup";

// ⚡ Inicializa telemetry antes de qualquer operação com Prisma
startTelemetry().catch((err) => console.error("Erro iniciando telemetry:", err));

// POST /api/equipe - Criar novo membro da equipe
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📦 Body recebido:", body);

    const { nome, email, funcao, status } = body;

    if (!nome || !email || !funcao) {
      return NextResponse.json(
        { error: "Nome, e-mail e função são obrigatórios." },
        { status: 400 }
      );
    }

    const statusValido = ["active", "inactive"];
    const statusFinal = status || "active";

    if (!statusValido.includes(statusFinal)) {
      return NextResponse.json(
        { error: `Status inválido. Use: ${statusValido.join(", ")}` },
        { status: 400 }
      );
    }

    const novoMembro = await prisma.equipe.create({
      data: { nome, email, funcao, status: statusFinal, usuario_id: null },
    });

    console.log("✅ Membro criado:", novoMembro);
    return NextResponse.json(novoMembro, { status: 201 });
  } catch (error: any) {
    console.error("❌ Erro ao criar membro:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar membro." },
      { status: 500 }
    );
  }
}

// GET /api/equipe - Listar todos os membros da equipe
export async function GET(req: NextRequest) {
  try {
    const equipe = await prisma.equipe.findMany({
      orderBy: { criado_em: "desc" },
    });

    return NextResponse.json(equipe, { status: 200 });
  } catch (error: any) {
    console.error("❌ Erro ao buscar equipe:", error);
    return NextResponse.json(
      { error: "Erro ao buscar equipe." },
      { status: 500 }
    );
  }
}
