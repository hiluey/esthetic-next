import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const agendamentos = await prisma.agendamentos.findMany({
      include: {
        clientes: true,
        servicos: true,
        usuarios_agendamentos_colaborador_idTousuarios: true,
        usuarios_agendamentos_usuario_idTousuarios: true,
      },
      orderBy: { data_hora: 'asc' },
    });

    return NextResponse.json(agendamentos);
  } catch (error: any) {
    console.error("Erro ao buscar agendamentos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar agendamentos", detalhes: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { usuario_id, cliente_id, servico_id, colaborador_id, data_hora } = body;

    if (!usuario_id || !cliente_id || !servico_id || !colaborador_id || !data_hora) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios." }, { status: 400 });
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
      include: {
        clientes: true,
        servicos: true,
        usuarios_agendamentos_colaborador_idTousuarios: true,
        usuarios_agendamentos_usuario_idTousuarios: true,
      },
    });

    return NextResponse.json(agendamento, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao criar agendamento", detalhes: error.message },
      { status: 500 }
    );
  }
}
