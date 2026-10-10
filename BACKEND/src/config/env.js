import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// El .env vive en BACKEND/, sin importar desde qué carpeta se ejecute el servidor.
// En producción (Vercel) las variables vienen de la plataforma y este archivo no existe.
const backendDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
dotenv.config({ path: path.join(backendDir, '.env') });

const requeridas = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET'];
const faltantes = requeridas.filter((nombre) => !process.env[nombre]);
if (faltantes.length > 0) {
  throw new Error(`Faltan variables de entorno: ${faltantes.join(', ')}. Revisa BACKEND/.env.example`);
}

if (process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET debe tener al menos 32 caracteres');
}

export const env = {
  port: Number(process.env.PORT) || 3000,
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME,
    // Certificado CA en PEM (Aiven y otros servicios en la nube exigen TLS).
    sslCa: process.env.DB_SSL_CA || null,
  },
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiracion: process.env.JWT_EXPIRES_IN || '8h',
  // Orígenes permitidos para CORS, separados por coma.
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((origen) => origen.trim())
    .filter(Boolean),
};
