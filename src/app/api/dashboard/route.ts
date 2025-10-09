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

    // Opcional: buscar metas e pagamentos para dashboard
    const metas = await prisma.metas_financeiras.findMany({
      include: { usuarios: true },
    });
    const pagamentos = await prisma.pagamentos.findMany({
      include: { agendamentos: true },
    });

    return NextResponse.json({ agendamentos, metas, pagamentos });
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

    // ========================
    // Se vier dados de financeiro
    // ========================
    if (body.meta || body.pagamentos) {
      const usuarioId = body.usuarioId;
      const meta = body.meta;
      const pagamentosData = body.pagamentos || [];

      let novaMeta = null;
      if (meta) {
        novaMeta = await prisma.metas_financeiras.create({
          data: {
            usuario_id: usuarioId,
            descricao: meta.descricao,
            valor_meta: meta.valor,
            periodo: meta.periodo,
          },
        });
      }

      const novosPagamentos = [];
      for (const p of pagamentosData) {
        // se quiser vincular a algum agendamento específico, adicione agendamento_id
        const pagamento = await prisma.pagamentos.create({
          data: {
            valor: p.valor,
            metodo_pagamento: p.metodo,
            data_pagamento: new Date(p.data),
          },
        });
        novosPagamentos.push(pagamento);
      }

      return NextResponse.json({ success: true, meta: novaMeta, pagamentos: novosPagamentos });
    }

    // ========================
    // Se vier dados de agendamento
    // ========================
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
    console.error("Erro ao criar registro:", error);
    return NextResponse.json(
      { error: "Erro ao criar registro", detalhes: error.message },
      { status: 500 }
    );
  }
}
