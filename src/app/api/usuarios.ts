import { NextApiRequest, NextApiResponse } from 'next';
import db from '../../lib/db';

type Usuario = {
  id: number;
  nome: string;
  email: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const [rows] = await db.query('SELECT * FROM usuarios');
      res.status(200).json(rows as Usuario[]);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
  } else if (req.method === 'POST') {
    const { nome, email } = req.body;

    if (!nome || !email) {
      return res.status(400).json({ message: 'Nome e email são obrigatórios' });
    }

    try {
      await db.query('INSERT INTO usuarios (nome, email) VALUES (?, ?)', [nome, email]);
      res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar usuário' });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
