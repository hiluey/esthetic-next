import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - listar produtos
export async function GET() {
  try {
    const produtos = await prisma.produtos.findMany({
      orderBy: { criado_em: "desc" },
    });
    return NextResponse.json(produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}

// POST - criar novo produto
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, estoque, validade, custo, preco_venda, usuario_id } = body;

    if (!nome || !preco_venda) {
      return NextResponse.json(
        { error: "Nome e preço de venda são obrigatórios" },
        { status: 400 }
      );
    }

    const novoProduto = await prisma.produtos.create({
      data: {
        nome,
        estoque: estoque ? Number(estoque) : 0,
        validade: validade ? new Date(validade) : null,
        custo: custo ? Number(custo) : 0,
        preco_venda: Number(preco_venda),
        usuario_id: usuario_id ? Number(usuario_id) : null,
      },
    });

    return NextResponse.json(novoProduto, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 });
  }
}
