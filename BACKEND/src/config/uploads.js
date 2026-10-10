import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

// Las imágenes existentes viven en BACKEND/src/uploads y la base guarda rutas "uploads/...".
export const UPLOADS_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'uploads');

const EXTENSIONES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
};

export const IMAGENES = ['image/jpeg', 'image/png', 'image/webp'];
export const DOCUMENTOS = [...IMAGENES, 'application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

/**
 * Middleware de multer para un campo de archivo.
 * El nombre se genera en el servidor (nunca se usa el nombre original) y solo se aceptan los tipos indicados.
 */
export const crearSubida = ({ carpeta, tipos, maxMB = 5 }) => {
  const destino = path.join(UPLOADS_DIR, carpeta);
  fs.mkdirSync(destino, { recursive: true });

  return multer({
    storage: multer.diskStorage({
      destination: destino,
      filename: (req, file, cb) => cb(null, `${crypto.randomUUID()}${EXTENSIONES[file.mimetype]}`),
    }),
    limits: { fileSize: maxMB * 1024 * 1024, files: 1 },
    fileFilter: (req, file, cb) => {
      if (tipos.includes(file.mimetype)) return cb(null, true);
      const error = new Error('Tipo de archivo no permitido');
      error.status = 400;
      error.expose = true;
      cb(error);
    },
  });
};

/** Ruta que se guarda en la base y que el frontend usa como `${API}/${ruta}`. */
export const rutaPublica = (archivo) =>
  path.relative(path.join(UPLOADS_DIR, '..'), archivo.path).split(path.sep).join('/');
