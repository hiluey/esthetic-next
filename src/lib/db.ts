import pkg from 'pg';
const { Pool } = pkg;

// Pool de conexões
const pool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
});

// Tipos
type Params = any[]; // você pode refinar depois
type Data = Record<string, any>;

// Função genérica para queries
export const query = async (text: string, params: Params = []): Promise<any[]> => {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res.rows;
  } finally {
    client.release();
  }
};

// Query que retorna 1 registro
export const queryOne = async (text: string, params: Params = []): Promise<any | null> => {
  const rows = await query(text, params);
  return rows[0] || null;
};

// Inserir registro
export const insert = async (table: string, data: Data): Promise<any> => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
  const rows = await query(sql, values);
  return rows[0];
};

// Atualizar registro
export const update = async (table: string, id: number, data: Data): Promise<any> => {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const setString = keys.map((k, i) => `${k}=$${i + 1}`).join(', ');

  const sql = `UPDATE ${table} SET ${setString} WHERE id=$${keys.length + 1} RETURNING *`;
  const rows = await query(sql, [...values, id]);
  return rows[0];
};

export default pool;
