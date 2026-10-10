import db from '../config/db.js';
import { errorServidor } from '../utils/errores.js';

// Verificaciones de propiedad (evitan que un usuario acceda a recursos ajenos cambiando un ID en la URL).

const consultarFila = async (sql, params) => {
  const [filas] = await db.promise().query(sql, params);
  return filas[0] ?? null;
};

const prohibido = (res, mensaje) => res.status(403).json({ error: mensaje });

/**
 * Mascota identificada por req.params[parametro].
 * - Dueño: solo si la mascota es suya.
 * - Veterinario: solo si `veterinarios` es true (lectura de fichas de pacientes).
 */
export const accesoMascota = ({ parametro = 'id', veterinarios = false } = {}) =>
  async (req, res, next) => {
    const { rol, sub } = req.usuario;
    if (rol === 'veterinario') {
      return veterinarios ? next() : prohibido(res, 'Solo el dueño puede modificar esta mascota');
    }
    try {
      const mascota = await consultarFila(
        'SELECT id_dueno FROM mascotas WHERE id_mascota = ?',
        [req.params[parametro]]
      );
      if (!mascota) return res.status(404).json({ error: 'Mascota no encontrada' });
      if (mascota.id_dueno !== sub) return prohibido(res, 'No tienes permiso sobre esta mascota');
      next();
    } catch (err) {
      errorServidor(res, 'Error al verificar permisos', err);
    }
  };

/**
 * Cita identificada por req.params.id.
 * - Dueño: si `dueno` es true y la cita es de una de sus mascotas.
 * - Veterinario: si es el veterinario asignado a la cita.
 */
export const accesoCita = ({ dueno = false } = {}) => async (req, res, next) => {
  const { rol, sub } = req.usuario;
  try {
    const cita = await consultarFila(
      `SELECT c.veterinario_id, m.id_dueno
       FROM citas c JOIN mascotas m ON c.mascota_id = m.id_mascota
       WHERE c.id = ?`,
      [req.params.id]
    );
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    const esDueno = dueno && rol === 'dueno' && cita.id_dueno === sub;
    const esVeterinarioAsignado = rol === 'veterinario' && String(cita.veterinario_id) === sub;
    if (!esDueno && !esVeterinarioAsignado) return prohibido(res, 'No tienes permiso sobre esta cita');
    next();
  } catch (err) {
    errorServidor(res, 'Error al verificar permisos', err);
  }
};

/**
 * Registro de historial clínico identificado por req.params.id.
 * - Lectura: el dueño de la mascota o cualquier veterinario.
 * - Escritura (`soloAutor`): únicamente el veterinario que creó el registro.
 */
export const accesoRegistroHistorial = ({ soloAutor = false } = {}) => async (req, res, next) => {
  const { rol, sub } = req.usuario;
  try {
    const registro = await consultarFila(
      `SELECT hc.veterinario_id, m.id_dueno
       FROM historial_clinico hc JOIN mascotas m ON hc.mascota_id = m.id_mascota
       WHERE hc.id = ?`,
      [req.params.id]
    );
    if (!registro) return res.status(404).json({ error: 'Registro no encontrado' });
    const esAutor = rol === 'veterinario' && String(registro.veterinario_id) === sub;
    const puedeLeer = rol === 'veterinario' || registro.id_dueno === sub;
    if (soloAutor ? !esAutor : !puedeLeer) {
      return prohibido(res, 'No tienes permiso sobre este registro');
    }
    next();
  } catch (err) {
    errorServidor(res, 'Error al verificar permisos', err);
  }
};
