import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startTelemetry } from "@/lib/otel-setup";

startTelemetry().catch((err) =>
  console.error("Erro iniciando telemetry:", err)
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { usuario_id, descricao, valor_meta, periodo, valor, metodo_pagamento, data_pagamento } = body;

    // =========================
    // Salvar Meta Financeira
    // =========================
    if (descricao && valor_meta && periodo) {
      if (!usuario_id) {
        return NextResponse.json({ error: "Campo usuario_id é obrigatório para meta" }, { status: 400 });
      }

      const meta = await prisma.metas_financeiras.create({
        data: {
          usuario_id: Number(usuario_id),
          descricao,
          valor_meta: Number(valor_meta),
          periodo,
        },
      });

      return NextResponse.json({ success: true, meta });
    }

    // =========================
    // Salvar Pagamento
    // =========================
    if (descricao && valor && metodo_pagamento && data_pagamento) {
      if (!usuario_id) {
        return NextResponse.json({ error: "Campo usuario_id é obrigatório para pagamento" }, { status: 400 });
      }

      const pagamento = await prisma.pagamentos.create({
        data: {
          valor: Number(valor),
          metodo_pagamento,
          data_pagamento: new Date(data_pagamento),
          // Se você quiser associar a um agendamento, pode adicionar agendamento_id aqui
        },
      });

      return NextResponse.json({ success: true, pagamento });
    }

    return NextResponse.json({ error: "Campos obrigatórios não preenchidos" }, { status: 400 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao salvar dados", detalhes: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Buscar todas as metas e pagamentos do usuário (opcional: filtrar por usuario_id)
    const metas = await prisma.metas_financeiras.findMany();
    const pagamentos = await prisma.pagamentos.findMany();

    return NextResponse.json({ metas, pagamentos });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao buscar dados", detalhes: error.message }, { status: 500 });
  }
}