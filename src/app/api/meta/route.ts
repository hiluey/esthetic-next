import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const metas = await prisma.metas_financeiras.findMany({
      orderBy: { criado_em: "desc" },
    });
    return NextResponse.json(metas);
  } catch (err) {
    return NextResponse.json({ error: "Erro ao buscar metas" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const novaMeta = await prisma.metas_financeiras.create({
      data: {
        usuario_id: data.usuario_id,
        descricao: data.descricao,
        valor_meta: data.valor_meta,
        periodo: data.periodo,
      },
    });
    return NextResponse.json(novaMeta);
  } catch (err) {
    return NextResponse.json({ error: "Erro ao criar meta" }, { status: 500 });
  }
}
