import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startTelemetry } from "@/lib/otel-setup";

// ⚡ Inicializa telemetry antes de qualquer operação de banco
startTelemetry().catch((err) => console.error("Erro iniciando telemetry:", err));

export async function GET(req: NextRequest) {
  try {
    const clientes = await prisma.clientes.findMany({
      include: { agendamentos: true },
      orderBy: { criado_em: "desc" },
    });
    return NextResponse.json(clientes);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json({ error: "Erro ao buscar clientes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nome, telefone, email } = body;

    if (!nome) {
      return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
    }

    const novoCliente = await prisma.clientes.create({
      data: { nome, telefone, email },
    });

    return NextResponse.json(novoCliente, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    return NextResponse.json({ error: "Erro ao criar cliente" }, { status: 500 });
  }
}
