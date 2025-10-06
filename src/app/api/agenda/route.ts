import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "../../../lib/getPrisma";

export async function POST(req: NextRequest) {
  try {
    const prisma = await getPrisma();
    const body = await req.json();
    const { usuario_id, cliente_id, servico_id, colaborador_id, data_hora } = body;

    console.log("📩 Dados recebidos pela API:", body);

    // converter IDs pra número, caso venham como string
    const uid = Number(usuario_id);
    const cid = Number(cliente_id);
    const sid = Number(servico_id);
    const colid = Number(colaborador_id);

    // Validação
    const usuario = await prisma.usuarios.findUnique({ where: { id: uid } });
    if (!usuario) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 400 });

    const cliente = await prisma.clientes.findUnique({ where: { id: cid } });
    if (!cliente) return NextResponse.json({ error: "Cliente não encontrado" }, { status: 400 });

    const servico = await prisma.servicos.findUnique({ where: { id: sid } });
    if (!servico) return NextResponse.json({ error: "Serviço não encontrado" }, { status: 400 });

    const colaborador = await prisma.usuarios.findUnique({ where: { id: colid } });
    if (!colaborador) return NextResponse.json({ error: "Colaborador não encontrado" }, { status: 400 });

    const agendamento = await prisma.agendamentos.create({
      data: {
        usuario_id: uid,
        cliente_id: cid,
        servico_id: sid,
        colaborador_id: colid,
        data_hora: new Date(data_hora),
      },
    });

    return NextResponse.json(agendamento);
  } catch (error: any) {
    console.error("❌ Erro ao salvar agendamento:", error);
    return NextResponse.json(
      { error: "Erro ao salvar agendamento", detalhes: error.message },
      { status: 500 }
    );
  }
}
