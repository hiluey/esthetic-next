// src/app/api/equipe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nome, email, funcao, status } = body;

    // Validação mínima
    if (!nome || !email || !funcao) {
      return NextResponse.json(
        { error: "Nome, email e função são obrigatórios" },
        { status: 400 }
      );
    }

    // Validação do enum StatusMembro
    const statusValido = ["ativo", "inativo"];
    if (!statusValido.includes(status)) {
      return NextResponse.json(
        { error: `Status inválido. Deve ser: ${statusValido.join(", ")}` },
        { status: 400 }
      );
    }

    const novoMembro = await prisma.equipe.create({
      data: {
        nome,
        email,
        funcao,
        status, // "ativo" ou "inativo"
        usuario_id: null, // opcional
      },
    });

    return NextResponse.json(novoMembro, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar membro:", error);
    return NextResponse.json(
      { error: "Erro interno ao criar membro" },
      { status: 500 }
    );
  }
}
