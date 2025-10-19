"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { startTelemetry } from "@/lib/otel-setup";

startTelemetry().catch((err) =>
  console.error("Erro iniciando telemetry:", err)
);

const SALT_ROUNDS = 10;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      fullName,
      email,
      password,
      businessName,
      monthlyGoal,
      businessGoals,
      appColor,
    } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Nome, e-mail e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.usuarios.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Já existe um usuário com esse e-mail" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const usuario = await prisma.usuarios.create({
      data: {
        nome: fullName,
        email,
        senha_hash: hashedPassword,
        nome_negocio: businessName || null,
        faturamento_mensal: monthlyGoal ? Number(monthlyGoal) : null,
        principais_metas: businessGoals || null,
        cor_app: appColor || null,
        tipo: "esteticista",
      },
    });

    // ✅ Setando o cookie para o novo usuário
    const res = NextResponse.json({ usuario }, { status: 201 });
    res.cookies.set("userId", String(usuario.id), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao criar usuário", detalhes: error.message },
      { status: 500 }
    );
  }
}
