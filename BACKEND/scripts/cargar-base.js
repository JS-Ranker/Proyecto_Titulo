// Crea las tablas (db/schema.sql) y carga los datos demo (db/seed.sql) en la base configurada en BACKEND/.env.
//
//   npm run db:cargar                → solo muestra a qué base se conectaría y qué tablas tiene
//   npm run db:cargar -- --confirmar → crea las tablas y carga los datos (la base debe estar vacía)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import { env } from '../src/config/env.js';

const dbDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'db');
const confirmar = process.argv.includes('--confirmar');

const conexion = await mysql.createConnection({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  multipleStatements: true,
  ...(env.db.sslCa && { ssl: { ca: env.db.sslCa, rejectUnauthorized: true } }),
});

try {
  const [[{ version }]] = await conexion.query('SELECT VERSION() AS version');
  const [tablas] = await conexion.query('SHOW TABLES');
  console.log(`Conectado a ${env.db.host}:${env.db.port} / base "${env.db.database}" (MySQL ${version}, TLS: ${env.db.sslCa ? 'sí' : 'no'})`);
  console.log(`Tablas existentes: ${tablas.length}`);

  if (!confirmar) {
    console.log('\nNo se modificó nada. Ejecuta con --confirmar para crear las tablas y cargar los datos demo.');
  } else if (tablas.length > 0) {
    console.log('\nLa base ya tiene tablas: no se cargó nada para no mezclar ni duplicar datos.');
    process.exitCode = 1;
  } else {
    for (const archivo of ['schema.sql', 'seed.sql']) {
      await conexion.query(fs.readFileSync(path.join(dbDir, archivo), 'utf8'));
      console.log(`✔ ${archivo} aplicado`);
    }
    const [[conteo]] = await conexion.query(
      'SELECT (SELECT COUNT(*) FROM duenos) AS duenos, (SELECT COUNT(*) FROM veterinarios) AS veterinarios, (SELECT COUNT(*) FROM mascotas) AS mascotas, (SELECT COUNT(*) FROM adopciones) AS adopciones'
    );
    console.log('Datos cargados:', conteo);
  }
} finally {
  await conexion.end();
}
