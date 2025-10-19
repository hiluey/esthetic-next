import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startTelemetry } from "@/lib/otel-setup";

// ⚡ Inicializa telemetry antes de qualquer operação de banco
startTelemetry().catch((err) =>
  console.error("Erro iniciando telemetry:", err)
);

export async function GET(req: NextRequest) {
  try {
    // Pega o userId do cookie
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/userId=(\d+)/);
    const userId = match ? Number(match[1]) : null;

    if (!userId) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // Busca apenas os agendamentos do usuário logado
    const agendamentos = await prisma.agendamentos.findMany({
      where: { usuario_id: userId },
      include: {
        clientes: true,
        servicos: true,
        usuarios_agendamentos_usuario_idTousuarios: true,
        usuarios_agendamentos_colaborador_idTousuarios: true,
      },
      orderBy: { data_hora: "asc" },
    });

    return NextResponse.json(agendamentos);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao buscar agendamentos", detalhes: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      usuario_id,
      cliente_id,
      servico_id,
      colaborador_id,
      data_hora,
      procedimento,
      valor,
      hora_marcada,
    } = body;

    if (!data_hora)
      return NextResponse.json(
        { error: "Data e hora são obrigatórias" },
        { status: 400 }
      );

    // Convertendo IDs
    const uid = Number(usuario_id);
    const cid = Number(cliente_id);
    const sid = Number(servico_id);
    const colid = Number(colaborador_id);

    // Verificações
    const usuario = await prisma.usuarios.findUnique({ where: { id: uid } });
    if (!usuario)
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 400 });

    const cliente = await prisma.clientes.findUnique({ where: { id: cid } });
    if (!cliente)
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 400 });

    const servico = await prisma.servicos.findUnique({ where: { id: sid } });
    if (!servico)
      return NextResponse.json({ error: "Serviço não encontrado" }, { status: 400 });

    const colaborador = await prisma.usuarios.findUnique({ where: { id: colid } });
    if (!colaborador)
      return NextResponse.json({ error: "Colaborador não encontrado" }, { status: 400 });

    // Criação do agendamento
    const agendamento = await prisma.agendamentos.create({
      data: {
        usuario_id: uid,
        cliente_id: cid,
        servico_id: sid,
        colaborador_id: colid,
        data_hora: new Date(data_hora),
        procedimento: procedimento?.length ? procedimento : null,
        valor: valor ? Number(valor) : null,
        status: "agendado",
        pago: false,
      },
      include: {
        clientes: true,
        servicos: true,
        usuarios_agendamentos_usuario_idTousuarios: true,
        usuarios_agendamentos_colaborador_idTousuarios: true,
      },
    });

    return NextResponse.json(agendamento);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao salvar agendamento", detalhes: error.message },
      { status: 500 }
    );
  }
}
