import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { put } from '@vercel/blob';

// Archivos públicos (BACKEND/public). En Vercel esta carpeta la sirve el CDN, porque express.static() no
// funciona ahí; en local la sirve Express. La base guarda rutas "uploads/..." relativas a esta carpeta.
export const PUBLIC_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'public');

// En Vercel el disco no es persistente: si hay un Blob store conectado, las subidas nuevas van ahí.
const usarBlob = Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);

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

// Vercel limita el cuerpo de cada petición a 4,5 MB
const MAX_MB = 4;

const nombreSeguro = (file) => `${crypto.randomUUID()}${EXTENSIONES[file.mimetype]}`;

/**
 * Middleware para subir un archivo en el campo indicado.
 * El nombre lo genera el servidor (nunca se usa el original) y solo se aceptan los tipos indicados.
 * Tras subirlo, `req.file.urlPublica` contiene lo que se guarda en la base.
 */
export const crearSubida = ({ carpeta, tipos }) => {
  const fileFilter = (req, file, cb) => {
    if (tipos.includes(file.mimetype)) return cb(null, true);
    const error = new Error('Tipo de archivo no permitido');
    error.status = 400;
    error.expose = true;
    cb(error);
  };
  const limits = { fileSize: MAX_MB * 1024 * 1024, files: 1 };

  if (usarBlob) {
    const subir = multer({ storage: multer.memoryStorage(), limits, fileFilter });
    return {
      single: (campo) => [
        subir.single(campo),
        async (req, res, next) => {
          if (!req.file) return next();
          try {
            const blob = await put(`${carpeta}/${nombreSeguro(req.file)}`, req.file.buffer, {
              access: 'public',
              contentType: req.file.mimetype,
              addRandomSuffix: false,
            });
            req.file.urlPublica = blob.url;
            next();
          } catch (err) {
            next(err);
          }
        },
      ],
    };
  }

  // En Vercel el disco es de solo lectura: sin Blob conectado, las subidas fallan pero el resto de la API sigue funcionando
  if (process.env.VERCEL) {
    const sinAlmacenamiento = (req, res) =>
      res.status(503).json({ error: 'La subida de archivos no está configurada en este entorno' });
    return { single: () => [sinAlmacenamiento] };
  }

  const destino = path.join(PUBLIC_DIR, 'uploads', carpeta);
  fs.mkdirSync(destino, { recursive: true });
  const subir = multer({
    storage: multer.diskStorage({
      destination: destino,
      filename: (req, file, cb) => cb(null, nombreSeguro(file)),
    }),
    limits,
    fileFilter,
  });
  return {
    single: (campo) => [
      subir.single(campo),
      (req, res, next) => {
        if (req.file) {
          req.file.urlPublica = path.relative(PUBLIC_DIR, req.file.path).split(path.sep).join('/');
        }
        next();
      },
    ],
  };
};

/** Valor que se guarda en la base: URL absoluta de Blob o ruta "uploads/..." en local. */
export const rutaPublica = (archivo) => archivo.urlPublica;
