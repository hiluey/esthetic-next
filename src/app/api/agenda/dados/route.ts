import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Busca os dados do banco
        const usuarios = await prisma.usuarios.findMany({
            select: { id: true, nome: true },
            orderBy: { nome: "asc" },
        });

        const clientes = await prisma.clientes.findMany({
            select: { id: true, nome: true },
            orderBy: { nome: "asc" },
        });

        const servicos = await prisma.servicos.findMany({
            select: { id: true, nome: true },
            orderBy: { nome: "asc" },
        });
        const colaboradores = await prisma.usuarios.findMany({
            where: { tipo: "colaborador" },
            select: { id: true, nome: true },
        });


        return NextResponse.json({
            usuarios,
            clientes,
            servicos,
            colaboradores,
        });
    } catch (error: any) {
        console.error("[ERRO_DADOS_AGENDA]", error);
        return NextResponse.json(
            { error: "Erro ao buscar dados do agendamento", detalhes: error.message },
            { status: 500 }
        );
    }
}