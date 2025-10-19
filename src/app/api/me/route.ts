// app/api/me/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startTelemetry } from "@/lib/otel-setup";

startTelemetry().catch((err) =>
  console.error("Erro iniciando telemetry:", err)
);

export async function GET(req: Request) {
  // Pega os cookies do header manualmente
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/userId=(\d+)/);
  const userId = match ? match[1] : null;

  if (!userId) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const user = await prisma.usuarios.findUnique({
    where: { id: Number(userId) },
    select: {
      id: true,
      nome: true,
      email: true,
      tipo: true,
      nome_negocio: true,
      cor_app: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  return NextResponse.json(user);
}
