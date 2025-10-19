import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startTelemetry } from "@/lib/otel-setup";

startTelemetry().catch((err) =>
  console.error("Erro iniciando telemetry:", err)
);

export async function GET() {
  const cookieStore = await cookies(); 
  const userId = cookieStore.get("userId")?.value;

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