import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startTelemetry } from "@/lib/otel-setup";

startTelemetry().catch((err) =>
  console.error("Erro iniciando telemetry:", err)
);

export async function POST(req: NextRequest) {
  try {
    const { usuario_id, tipo, texto, data_envio } = await req.json();

    const novaMensagem = await prisma.mensagens_marketing.create({
      data: {
        usuario_id,
        tipo,
        texto,
        data_envio: data_envio ? new Date(data_envio) : null,
      },
    });

    return NextResponse.json(novaMensagem);
  } catch (error) {
    console.error("Erro ao criar mensagem:", error);
    return NextResponse.json({ error: "Erro ao criar mensagem" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const mensagens = await prisma.mensagens_marketing.findMany({
      orderBy: { criado_em: "desc" },
    });
    return NextResponse.json(mensagens);
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return NextResponse.json({ error: "Erro ao buscar mensagens" }, { status: 500 });
  }
}
