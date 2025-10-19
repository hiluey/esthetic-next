import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startTelemetry } from "@/lib/otel-setup";

type StatusAgendamento = "cancelado" | "realizado" | "agendado" | null;

// Função utilitária para converter valores Decimal ou qualquer tipo em number
function toNumber(value: any): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  if (typeof value.toNumber === "function") return value.toNumber();
  return Number(value) || 0;
}

// ⚡ Inicializa telemetry no topo
startTelemetry().catch((err) =>
  console.error("Erro iniciando telemetry:", err)
);

export async function GET() {
  try {
    const agendamentos = await prisma.agendamentos.findMany({
      include: {
        clientes: true,
        servicos: true,
        usuarios_agendamentos_colaborador_idTousuarios: true,
        usuarios_agendamentos_usuario_idTousuarios: true,
      },
      orderBy: { data_hora: "asc" },
    });

    const faturamento = agendamentos.reduce(
      (total, item) => total + toNumber(item.valor),
      0
    );

    const atendimentos = agendamentos.filter(
      (a) => a.status === "agendado" || a.status === "realizado"
    ).length;

    const ticketMedio = atendimentos > 0 ? faturamento / atendimentos : 0;

    const metas = await prisma.metas_financeiras.findMany({
      where: { atingida: false },
    });

    const metaMensal = metas.length > 0 ? toNumber(metas[0].valor_meta) : 0;

    const progressoMeta =
      metaMensal > 0 ? Math.min((faturamento / metaMensal) * 100, 100) : 0;

    const stats = {
      faturamento,
      atendimentos,
      ticketMedio,
      metaMensal,
      progressoMeta,
    };

    const pagamentos = await prisma.pagamentos.findMany({
      include: { agendamentos: true },
    });

    return NextResponse.json({ stats, agendamentos, metas, pagamentos });
  } catch (error: any) {
    console.error("Erro ao buscar dados do dashboard:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados do dashboard", detalhes: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

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
        const pagamento = await prisma.pagamentos.create({
          data: {
            valor: p.valor,
            metodo_pagamento: p.metodo,
            data_pagamento: new Date(p.data),
          },
        });
        novosPagamentos.push(pagamento);
      }

      return NextResponse.json({
        success: true,
        meta: novaMeta,
        pagamentos: novosPagamentos,
      });
    }

    const {
      usuario_id,
      cliente_id,
      servico_id,
      colaborador_id,
      data_hora,
      procedimento,
      valor,
      status = "agendado",
      pago = false,
    }: {
      usuario_id: number;
      cliente_id: number;
      servico_id: number;
      colaborador_id: number;
      data_hora: string;
      procedimento?: string | null;
      valor?: number | null;
      status?: StatusAgendamento;
      pago?: boolean;
    } = body;

    if (!usuario_id || !cliente_id || !servico_id || !colaborador_id || !data_hora) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos." },
        { status: 400 }
      );
    }

    const agendamento = await prisma.agendamentos.create({
      data: {
        usuario_id,
        cliente_id,
        servico_id,
        colaborador_id,
        procedimento,
        valor,
        data_hora: new Date(data_hora),
        status,
        pago,
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
