import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function POST(req: NextRequest) {
  try {
    const { usuarioId, meta, pagamentos } = await req.json();

    if (!usuarioId) {
      return NextResponse.json({ error: "Usuário não informado" }, { status: 400 });
    }

    if (meta) {
      const metaExistente = await prisma.metas_financeiras.findFirst({
        where: { usuario_id: usuarioId },
      });

      if (metaExistente) {
        await prisma.metas_financeiras.update({
          where: { id: metaExistente.id },
          data: {
            descricao: meta.descricao,
            valor_meta: meta.valor,
            periodo: meta.periodo,
            atingida: false,
          },
        });
      } else {
        await prisma.metas_financeiras.create({
          data: {
            usuario_id: usuarioId,
            descricao: meta.descricao,
            valor_meta: meta.valor,
            periodo: meta.periodo,
          },
        });
      }
    }


    if (pagamentos && pagamentos.length > 0) {
      const pagamentosData = pagamentos.map((p: any) => ({
        valor: p.valor,
        metodo_pagamento: p.metodo,
        data_pagamento: p.data,
        status: "pendente", 
        agendamento_id: null, 
      }));

      await prisma.pagamentos.createMany({
        data: pagamentosData,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
