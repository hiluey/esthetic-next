import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma"; // <- Importa o namespace correto

export async function GET() {
  try {
    const usuarioId = 1; // 🔒 Substituir pelo ID do usuário autenticado

    // Início do mês atual
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    // 1. Faturamento do mês
    const faturamentoMes = await prisma.pagamentos.aggregate({
      _sum: { valor: true },
      where: {
        status: "confirmado",
        data_pagamento: { gte: inicioMes },
        agendamentos: { usuario_id: usuarioId },
      },
    });

    // 2. Contagem atendimentos realizados no mês
    const atendimentosMes = await prisma.agendamentos.count({
      where: {
        data_hora: { gte: inicioMes },
        status: "realizado",
        usuario_id: usuarioId,
      },
    });

    // 3. Ticket médio
    const ticketMedio = atendimentosMes
      ? (faturamentoMes._sum.valor ?? 0) / atendimentosMes
      : 0;

    // 4. Meta mensal
    const meta = await prisma.metas_financeiras.findFirst({
      where: {
        usuario_id: usuarioId,
        periodo: "mensal",
      },
      orderBy: {
        criado_em: "desc",
      },
    });

    // 5. Progresso da meta
    const progressoMeta = meta?.valor_meta
      ? ((faturamentoMes._sum.valor ?? 0) / meta.valor_meta) * 100
      : 0;

    // 6. Gráfico dos últimos 6 meses
    const seisMesesAtras = new Date();
    seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 5);
    seisMesesAtras.setDate(1);
    seisMesesAtras.setHours(0, 0, 0, 0);

    const faturamentoUltimosMeses = await prisma.pagamentos.groupBy({
      by: ["data_pagamento"],
      _sum: { valor: true },
      where: {
        status: "confirmado",
        data_pagamento: { gte: seisMesesAtras },
        agendamentos: { usuario_id: usuarioId },
      },
    });

    const mesesMap = new Map<string, number>();

    for (let i = 0; i < 6; i++) {
      const date = new Date(seisMesesAtras);
      date.setMonth(date.getMonth() + i);
      const monthName = date.toLocaleString("pt-BR", { month: "short" });
      mesesMap.set(monthName, 0);
    }

    for (const item of faturamentoUltimosMeses) {
      const monthName = item.data_pagamento?.toLocaleString("pt-BR", {
        month: "short",
      });
      if (monthName) {
        mesesMap.set(
          monthName,
          (mesesMap.get(monthName) ?? 0) + (item._sum.valor ?? 0),
        );
      }
    }

    const chartData = Array.from(mesesMap, ([month, revenue]) => ({
      month,
      revenue,
    }));

    // 7. Agenda do dia
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);

    // 💡 Definindo o tipo corretamente com relacionamento incluído
    type AgendaHojeItem = Prisma.agendamentosGetPayload<{
      include: { servicos: true };
    }>;

    const agendaHoje: AgendaHojeItem[] = await prisma.agendamentos.findMany({
      where: {
        usuario_id: usuarioId,
        data_hora: { gte: hoje, lt: amanha },
        status: "agendado",
      },
      include: {
        servicos: true, // ⚠️ Usa o nome exato da propriedade do model
      },
      orderBy: {
        data_hora: "asc",
      },
    });

    const dailyAgenda = agendaHoje.map((item) => ({
      time: item.data_hora?.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      procedure: item.servicos?.nome ?? "N/A",
      value: item.servicos?.preco ?? 0,
    }));

    // ✅ Retorno final
    return NextResponse.json({
      faturamento: faturamentoMes._sum.valor ?? 0,
      atendimentos: atendimentosMes,
      ticketMedio,
      metaMensal: meta?.valor_meta ?? 0,
      progressoMeta: parseFloat(progressoMeta.toFixed(2)),
      chartData,
      dailyAgenda,
    });
  } catch (error) {
    console.error("Erro no endpoint /api/dashboard", error);
    return NextResponse.json(
      { error: "Erro ao carregar dados" },
      { status: 500 },
    );
  }
}
