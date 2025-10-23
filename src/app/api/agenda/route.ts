import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * =====================
 * POST – Criar Agendamento
 * =====================
 */
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
      status_pagamento,
    } = body;

    if (!data_hora)
      return NextResponse.json(
        { error: "Data e hora são obrigatórias" },
        { status: 400 }
      );

    const uid = Number(usuario_id);
    const cid = Number(cliente_id);
    const sid = Number(servico_id);
    const colid = Number(colaborador_id);

    const usuario = await prisma.usuarios.findUnique({ where: { id: uid } });
    if (!usuario)
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 400 }
      );

    const cliente = await prisma.clientes.findUnique({ where: { id: cid } });
    if (!cliente)
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 400 }
      );

    const servico = await prisma.servicos.findUnique({ where: { id: sid } });
    if (!servico)
      return NextResponse.json(
        { error: "Serviço não encontrado" },
        { status: 400 }
      );

    const colaborador = await prisma.usuarios.findUnique({ where: { id: colid } });
    if (!colaborador)
      return NextResponse.json(
        { error: "Colaborador não encontrado" },
        { status: 400 }
      );

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
        status_pagamento: status_pagamento || "nao_pagou",
        hora_marcada: hora_marcada || null,
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

/**
 * =====================
 * GET – Listar Agendamentos (para o calendário)
 * =====================
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const data = searchParams.get("data"); // exemplo: 2025-10-23

    const where = data
      ? {
          data_hora: {
            gte: new Date(`${data}T00:00:00.000Z`),
            lte: new Date(`${data}T23:59:59.999Z`),
          },
        }
      : {};

    const agendamentos = await prisma.agendamentos.findMany({
      where,
      include: {
        clientes: { select: { id: true, nome: true } },
        servicos: { select: { id: true, nome: true } },
        usuarios_agendamentos_colaborador_idTousuarios: {
          select: { id: true, nome: true },
        },
      },
      orderBy: { data_hora: "asc" },
    });

    // Normaliza os dados pro frontend
    const eventos = agendamentos.map((a) => ({
      id: a.id,
      title: `${a.clientes?.nome || "Sem cliente"} - ${a.servicos?.nome || ""}`,
      start: a.data_hora,
      end: a.data_hora, // opcionalmente +1h se quiser duração
      colaborador: a.usuarios_agendamentos_colaborador_idTousuarios?.nome || "",
      status_pagamento: a.status_pagamento,
      valor: a.valor,
    }));

    return NextResponse.json(eventos);
  } catch (error: any) {
    console.error("Erro ao listar agendamentos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar agendamentos", detalhes: error.message },
      { status: 500 }
    );
  }
}
