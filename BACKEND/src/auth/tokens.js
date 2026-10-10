import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';

const EMISOR = 'happy-pet-api';
const COSTO_HASH = 10;

/** @param {{ sub: string, rol: 'dueno' | 'veterinario' }} datos */
export const firmarToken = ({ sub, rol }) =>
  jwt.sign({ rol }, env.jwtSecret, {
    subject: String(sub),
    issuer: EMISOR,
    expiresIn: env.jwtExpiracion,
    algorithm: 'HS256',
  });

/** Devuelve { sub, rol } o lanza un error si el token es inválido o expiró. */
export const verificarToken = (token) => {
  const payload = jwt.verify(token, env.jwtSecret, { issuer: EMISOR, algorithms: ['HS256'] });
  return { sub: payload.sub, rol: payload.rol };
};

export const hashearPassword = (password) => bcrypt.hash(password, COSTO_HASH);

export const compararPassword = (password, hash) => bcrypt.compare(password, hash);

// Hash fijo para comparar cuando el usuario no existe: así la respuesta tarda lo mismo
// y no revela qué RUT o email están registrados.
export const HASH_FALSO = bcrypt.hashSync('usuario-inexistente', COSTO_HASH);
