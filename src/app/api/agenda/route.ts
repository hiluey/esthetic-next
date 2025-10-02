import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // seu prisma client

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const agenda = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        date: "asc",
      },
      select: {
        date: true,
        procedure: true,
        value: true,
        icon: true, // se você armazenar isso no banco, ou use um map na frente
      },
    });

    res.status(200).json(agenda);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar agenda" });
  }
}
