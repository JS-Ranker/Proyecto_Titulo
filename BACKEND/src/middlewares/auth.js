import { verificarToken } from '../auth/tokens.js';

// Exige un token válido en "Authorization: Bearer <token>" y deja la identidad en req.usuario.
export const requiereAuth = (req, res, next) => {
  const [esquema, token] = (req.headers.authorization || '').split(' ');
  if (esquema !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Debes iniciar sesión' });
  }
  try {
    req.usuario = verificarToken(token);
    next();
  } catch {
    return res.status(401).json({ error: 'Sesión inválida o expirada' });
  }
};

export const soloRol = (...roles) => (req, res, next) => {
  if (!roles.includes(req.usuario?.rol)) {
    return res.status(403).json({ error: 'No tienes permiso para esta acción' });
  }
  next();
};

// El recurso pertenece al usuario autenticado: compara el parámetro de la URL con su identidad.
// Ej.: mismoUsuario('dueno', 'rut') en /duenos/:rut solo deja pasar al dueño con ese RUT.
export const mismoUsuario = (rol, parametro) => (req, res, next) => {
  if (req.usuario?.rol !== rol || req.usuario.sub !== String(req.params[parametro])) {
    return res.status(403).json({ error: 'No tienes permiso sobre este recurso' });
  }
  next();
};

// Como mismoUsuario, pero además deja pasar a cualquier veterinario (personal de la clínica).
export const mismoDuenoOVeterinario = (parametro) => (req, res, next) => {
  if (req.usuario?.rol === 'veterinario') return next();
  return mismoUsuario('dueno', parametro)(req, res, next);
};
