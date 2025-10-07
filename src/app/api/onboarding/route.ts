"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

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

    // Validações básicas
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Nome, e-mail e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Checar se já existe usuário com o mesmo email
    const existingUser = await prisma.usuarios.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Já existe um usuário com esse e-mail" },
        { status: 400 }
      );
    }

    // Gerar hash da senha
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Criar usuário no banco
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

    return NextResponse.json({ usuario }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao criar usuário", detalhes: error.message },
      { status: 500 }
    );
  }
}
