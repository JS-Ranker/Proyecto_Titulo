import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// El .env vive en BACKEND/, sin importar desde qué carpeta se ejecute el servidor.
// En producción (Vercel) las variables vienen de la plataforma y este archivo no existe.
const backendDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
dotenv.config({ path: path.join(backendDir, '.env') });

// La base guarda fechas sin zona horaria (hora de la clínica). Vercel corre en UTC, así que se fija
// la zona de la clínica para que mysql2 interprete y entregue esas fechas en la hora correcta.
process.env.TZ = process.env.APP_TIMEZONE || 'America/Santiago';

const requeridas = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];
const faltantes = requeridas.filter((nombre) => !process.env[nombre]);
if (faltantes.length > 0) {
  throw new Error(`Faltan variables de entorno: ${faltantes.join(', ')}. Revisa BACKEND/.env.example`);
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET debe tener al menos 32 caracteres');
}

// Certificado CA para TLS: en Vercel se pega el contenido en DB_SSL_CA;
// en local es más cómodo apuntar al archivo descargado con DB_SSL_CA_FILE (ruta relativa a BACKEND/).
const leerCertificadoCA = () => {
  if (process.env.DB_SSL_CA) return process.env.DB_SSL_CA.replace(/\\n/g, '\n');
  if (process.env.DB_SSL_CA_FILE) return fs.readFileSync(path.resolve(backendDir, process.env.DB_SSL_CA_FILE), 'utf8');
  return null;
};

export const env = {
  port: Number(process.env.PORT) || 3000,
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME,
    // Certificado CA en PEM (Aiven y otros servicios en la nube exigen TLS).
    sslCa: leerCertificadoCA(),
  },
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiracion: process.env.JWT_EXPIRES_IN || '8h',
  // Orígenes permitidos para CORS, separados por coma.
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((origen) => origen.trim())
    .filter(Boolean),
};
