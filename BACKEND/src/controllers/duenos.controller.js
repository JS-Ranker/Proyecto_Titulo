import Dueno from '../models/duenos.model.js';
import { errorServidor } from '../utils/errores.js';
import { ejecutar } from '../utils/promesa.js';
import { compararPassword, firmarToken, hashearPassword, HASH_FALSO } from '../auth/tokens.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TELEFONO_REGEX = /^\d{8,12}$/;
const PASSWORD_MINIMA = 6;

// Valida los datos de contacto comunes a registro y actualización. Devuelve un mensaje de error o null.
const validarContacto = (datos) => {
  const faltantes = ['nombre', 'apellido', 'email'].filter((campo) => !datos[campo]);
  if (faltantes.length > 0) return `Faltan campos requeridos: ${faltantes.join(', ')}`;
  if (!EMAIL_REGEX.test(datos.email)) return 'El formato del email no es válido';
  if (datos.telefono && String(datos.telefono).trim()
      && !TELEFONO_REGEX.test(String(datos.telefono).replace(/\s/g, ''))) {
    return 'El teléfono debe contener entre 8 y 12 dígitos';
  }
  return null;
};

// Traer todos los dueños (solo personal de la clínica; nunca incluye contraseñas)
export const TraerDuenos = (req, res) => {
  Dueno.traer((err, duenos) => {
    if (err) {
      return errorServidor(res, 'Error al traer los dueños', err);
    }
    res.status(200).json(duenos);
  });
};

// Registrar un dueño
export const CrearDueno = async (req, res) => {
  const datos = req.body ?? {};

  const errorContacto = validarContacto(datos);
  if (!datos.rut) return res.status(400).json({ error: 'El RUT es requerido' });
  if (errorContacto) return res.status(400).json({ error: errorContacto });
  if (!datos.password || datos.password.length < PASSWORD_MINIMA) {
    return res.status(400).json({ error: `La contraseña debe tener al menos ${PASSWORD_MINIMA} caracteres` });
  }

  try {
    const password = await hashearPassword(datos.password);
    await ejecutar(Dueno.crear, { ...datos, password });
    res.status(201).json({ mensaje: 'Dueño creado exitosamente', rut: datos.rut });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese RUT o email' });
    }
    errorServidor(res, 'Error al crear el dueño', err);
  }
};

// Actualizar datos de contacto y, opcionalmente, la contraseña (exige la contraseña actual)
export const ActualizarDueno = async (req, res) => {
  const { rut } = req.params;
  const datos = req.body ?? {};

  const errorContacto = validarContacto(datos);
  if (errorContacto) return res.status(400).json({ error: errorContacto });

  const cambiaPassword = Boolean(datos.password_nueva);
  if (cambiaPassword) {
    if (!datos.password_actual) {
      return res.status(400).json({ error: 'Debes ingresar tu contraseña actual' });
    }
    if (datos.password_nueva.length < PASSWORD_MINIMA) {
      return res.status(400).json({ error: `La contraseña debe tener al menos ${PASSWORD_MINIMA} caracteres` });
    }
  }

  try {
    if (cambiaPassword) {
      const cuenta = await ejecutar(Dueno.buscarPorRut, rut);
      if (!cuenta) return res.status(404).json({ error: 'Dueño no encontrado' });
      if (!(await compararPassword(datos.password_actual, cuenta.password))) {
        return res.status(401).json({ error: 'La contraseña actual no es correcta' });
      }
    }

    const resultado = await ejecutar(Dueno.update, rut, datos);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Dueño no encontrado' });
    }

    if (cambiaPassword) {
      await ejecutar(Dueno.actualizarPassword, rut, await hashearPassword(datos.password_nueva));
    }

    res.status(200).json({ mensaje: 'Dueño actualizado correctamente' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Ese email ya está registrado' });
    }
    errorServidor(res, 'Error al actualizar el dueño', err);
  }
};

// Desactivar un dueño
export const DesactivarDueno = (req, res) => {
  const { rut } = req.params;

  Dueno.desactivar(rut, (err) => {
    if (err) {
      return errorServidor(res, 'Error al desactivar el dueño', err);
    }
    res.status(200).json({ mensaje: 'Dueño desactivado' });
  });
};

// Activar un dueño
export const activarDueno = (req, res) => {
  const { rut } = req.params;

  Dueno.activar(rut, (err) => {
    if (err) {
      return errorServidor(res, 'Error al activar al dueño', err);
    }
    res.status(200).json({ mensaje: 'Dueño activado exitosamente' });
  });
};

// Traer un dueño específico por rut
export const TraerDuenoPorRut = (req, res) => {
  const { rut } = req.params;

  Dueno.buscarDatosPorRut(rut, (err, dueno) => {
    if (err) {
      return errorServidor(res, 'Error al buscar el dueño', err);
    }
    if (!dueno) {
      return res.status(404).json({ error: 'Dueño no encontrado' });
    }
    res.status(200).json(dueno);
  });
};

// Inicio de sesión: responde los datos del dueño y un token JWT
export const loginDueno = async (req, res) => {
  const { rut, password } = req.body ?? {};
  if (!rut || !password) {
    return res.status(400).json({ error: 'RUT y contraseña son requeridos' });
  }

  try {
    const cuenta = await ejecutar(Dueno.buscarPorRut, rut);
    // Se compara siempre (con un hash falso si no existe) para no revelar qué RUT están registrados
    const passwordValida = await compararPassword(password, cuenta?.password ?? HASH_FALSO);
    if (!cuenta || !passwordValida) {
      return res.status(401).json({ error: 'RUT o contraseña incorrectos' });
    }
    if (cuenta.activo !== 1) {
      return res.status(403).json({ error: 'Usuario inactivo' });
    }

    const datosDueno = await ejecutar(Dueno.buscarDatosPorRut, rut);
    const token = firmarToken({ sub: cuenta.rut, rol: 'dueno' });
    res.status(200).json({ ...datosDueno, token });
  } catch (err) {
    errorServidor(res, 'Error al iniciar sesión', err);
  }
};
