import pkg from 'pg';
const { Pool } = pkg;

// Importa os tipos do pg
import type { PoolClient, QueryResult } from 'pg';

type Params = any[];
type Data = Record<string, any>;

// Evita abrir múltiplas conexões no serverless
declare global {
  var pgPool: InstanceType<typeof Pool> | undefined;
}

const pool: InstanceType<typeof Pool> = global.pgPool ?? new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

if (!global.pgPool) global.pgPool = pool;

// Exemplo de função de query
export const query = async (text: string, params: Params = []): Promise<any[]> => {
  const client: PoolClient = await pool.connect();
  try {
    const res: QueryResult = await client.query(text, params);
    return res.rows;
  } finally {
    client.release();
  }
};

export default pool;
