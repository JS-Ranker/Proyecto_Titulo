import mysql from 'mysql2';
import { env } from './env.js';

// Pool en lugar de una conexión única: se recupera solo si una conexión se cae
// y funciona en entornos serverless, donde cada instancia abre las suyas.
const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 5,
  ...(env.db.sslCa && { ssl: { ca: env.db.sslCa, rejectUnauthorized: true } }),
});

export default pool;
