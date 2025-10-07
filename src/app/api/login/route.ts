import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.usuarios.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 400 });

  const isPasswordValid = await bcrypt.compare(password, user.senha_hash!);
  if (!isPasswordValid) return NextResponse.json({ error: "Senha incorreta" }, { status: 400 });

  const response = NextResponse.json({ success: true });
  response.cookies.set("token", "meu_token_seguro", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return response;
}
