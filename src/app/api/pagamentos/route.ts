import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pagamentos = await prisma.pagamentos.findMany({
      orderBy: { data_pagamento: "desc" },
    });
    return NextResponse.json(pagamentos);
  } catch (err) {
    return NextResponse.json({ error: "Erro ao buscar pagamentos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const pagamento = await prisma.pagamentos.create({
      data: {
        valor: data.valor,
        metodo_pagamento: data.metodo_pagamento,
        data_pagamento: data.data_pagamento,
        agendamento_id: data.agendamento_id || null,
      },
    });
    return NextResponse.json(pagamento);
  } catch (err) {
    return NextResponse.json({ error: "Erro ao criar pagamento" }, { status: 500 });
  }
}
