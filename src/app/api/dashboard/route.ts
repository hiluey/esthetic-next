import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { usuario_id, cliente_id, servico_id, colaborador_id, data_hora } = body;

    if (
      !usuario_id ||
      !cliente_id ||
      !servico_id ||
      !colaborador_id ||
      !data_hora
    ) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    const agendamento = await prisma.agendamentos.create({
      data: {
        usuario_id,
        cliente_id,
        servico_id,
        colaborador_id,
        data_hora: new Date(data_hora),
        status: "agendado",
        pago: false,
      },
    });

    return NextResponse.json(agendamento, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao criar agendamento." },
      { status: 500 }
    );
  }
}