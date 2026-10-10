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

// Desfase actual de la zona de la clínica, p. ej. "-03:00" (cambia con el horario de verano)
const desfaseActual = () => {
  const minutos = -new Date().getTimezoneOffset();
  const signo = minutos >= 0 ? '+' : '-';
  const abs = Math.abs(minutos);
  return `${signo}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`;
};

// Que NOW() y CURDATE() en MySQL usen la misma hora que la clínica (los servidores en la nube están en UTC)
pool.on('connection', (conexion) => {
  conexion.query('SET time_zone = ?', [desfaseActual()]);
});

export default pool;
