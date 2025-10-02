import mysql from 'mysql2/promise';

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '7010511037105115',
      database: 'estetica_app',
    });

    const [rows] = await connection.execute('SELECT NOW() as now');
    console.log('Conexão OK! Data/hora do servidor:', rows[0].now);

    await connection.end();
  } catch (error) {
    console.error('Erro ao conectar ao banco:', error);
  }
}

testConnection();