import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { startTelemetry } from "@/lib/otel-setup";

// Inicializa Telemetry apenas em dev
if (process.env.NODE_ENV !== "production") {
  startTelemetry().catch((err) => console.error("Erro iniciando Telemetry:", err));
}

export async function POST(req: NextRequest) {
  try {
    console.log("DATABASE_URL:", process.env.DATABASE_URL);

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
    }

    const user = await prisma.usuarios.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.senha_hash!);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Senha incorreta" }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("userId", String(user.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Erro no endpoint /api/login:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor, veja logs para detalhes", detalhes: error.message },
      { status: 500 }
    );
  }
}
