import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const pagamentos = await prisma.pagamentos.findMany({
            orderBy: { data_pagamento: "desc" },
            include: {
                agendamentos: {
                    include: {
                        clientes: true
                    }
                }
            }
        });

        // Transformando para o formato que seu front usa
        const transactions = pagamentos.map(p => ({
            id: p.id,
            tipo: "receita", // você pode ajustar: receita/despesa/retirada dependendo da lógica
            descricao: p.agendamentos?.procedimento || "Pagamento",
            valor: Number(p.valor),
            metodo: p.metodo_pagamento || "outro",
            data: p.data_pagamento?.toISOString() || new Date().toISOString(),
            cliente: p.agendamentos?.clientes?.nome || undefined
        }));

        return NextResponse.json(transactions);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao buscar transações" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        const agendamento = data.agendamento_id
            ? { connect: { id: data.agendamento_id } }
            : undefined;

        const pagamento = await prisma.pagamentos.create({
            data: {
                valor: Number(data.valor),
                metodo_pagamento: data.metodo,
                data_pagamento: new Date(data.data),
                agendamentos: agendamento,
            },
            include: {
                agendamentos: {
                    include: { clientes: true }
                }
            }
        });

        const transaction = {
            id: pagamento.id,
            tipo: "receita",
            descricao: pagamento.agendamentos?.procedimento || "Pagamento",
            valor: Number(pagamento.valor),
            metodo: pagamento.metodo_pagamento || "outro",
            data: pagamento.data_pagamento
                ? pagamento.data_pagamento.toISOString()
                : new Date().toISOString(),

            cliente: pagamento.agendamentos?.clientes?.nome || undefined
        };

        return NextResponse.json(transaction);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Erro ao criar transação" }, { status: 500 });
    }
}
