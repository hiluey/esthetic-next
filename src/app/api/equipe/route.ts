import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/equipe - Criar novo membro da equipe
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📦 Body recebido:", body);

    const { nome, email, funcao, status } = body;

    // Validação mínima
    if (!nome || !email || !funcao) {
      return NextResponse.json(
        { error: "Nome, e-mail e função são obrigatórios." },
        { status: 400 }
      );
    }

    // Define status padrão ("active")
    const statusValido = ["active", "inactive"];
    const statusFinal = status || "active";

    if (!statusValido.includes(statusFinal)) {
      return NextResponse.json(
        { error: `Status inválido. Use: ${statusValido.join(", ")}` },
        { status: 400 }
      );
    }

    // Criação no banco
    const novoMembro = await prisma.equipe.create({
      data: {
        nome,
        email,
        funcao,
        status: statusFinal, // "active" ou "inactive"
        usuario_id: null,
      },
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
      orderBy: {
        criado_em: "desc", // opcional: ordenar por criação
      },
    });

    return NextResponse.json(equipe, { status: 200 });
  } catch (error) {
    console.error("❌ Erro ao buscar equipe:", error);
    return NextResponse.json(
      { error: "Erro ao buscar equipe." },
      { status: 500 }
    );
  }
}
