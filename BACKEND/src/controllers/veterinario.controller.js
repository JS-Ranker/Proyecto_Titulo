import Veterinario from '../models/veterinario.model.js';
import { errorServidor } from '../utils/errores.js';
import { ejecutar } from '../utils/promesa.js';
import { compararPassword, firmarToken, hashearPassword, HASH_FALSO } from '../auth/tokens.js';

const PASSWORD_MINIMA = 6;

export const traerVeterinariosPorEspecialidad = (req, res) => {
  const { especialidad_id } = req.params;
  Veterinario.traerPorEspecialidad(especialidad_id, (err, vets) => {
    if (err) return errorServidor(res, 'Error al obtener veterinarios', err);
    res.json(vets);
  });
};

// Login de veterinario: responde sus datos y un token JWT
export const loginVeterinario = async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  try {
    const [veterinario] = await ejecutar(Veterinario.loginVeterinario, email);
    // Se compara siempre (con un hash falso si no existe) para no revelar qué emails están registrados
    const passwordValida = await compararPassword(password, veterinario?.password ?? HASH_FALSO);
    if (!veterinario || !passwordValida) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const { password: _, ...veterinarioSinPassword } = veterinario;
    res.json({
      message: 'Login exitoso',
      data: veterinarioSinPassword,
      token: firmarToken({ sub: veterinario.id, rol: 'veterinario' }),
    });
  } catch (err) {
    errorServidor(res, 'Error al iniciar sesión', err);
  }
};

// Obtener todos los veterinarios
export const obtenerVeterinarios = (req, res) => {
  Veterinario.obtenerTodos((err, veterinarios) => {
    if (err) return errorServidor(res, 'Error al obtener veterinarios', err);
    res.json(veterinarios);
  });
};

// Obtener veterinario por ID
export const obtenerVeterinarioPorId = (req, res) => {
  const { id } = req.params;
  Veterinario.obtenerPorId(id, (err, veterinario) => {
    if (err) return errorServidor(res, 'Error al obtener veterinario', err);
    if (veterinario.length === 0) {
      return res.status(404).json({ error: 'Veterinario no encontrado' });
    }
    res.json(veterinario[0]);
  });
};

// Crear nuevo veterinario
export const crearVeterinario = async (req, res) => {
  const { nombre, email, telefono, password, especialidad_id, numero_licencia } = req.body ?? {};

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
  }
  if (password.length < PASSWORD_MINIMA) {
    return res.status(400).json({ error: `La contraseña debe tener al menos ${PASSWORD_MINIMA} caracteres` });
  }

  try {
    const existentes = await ejecutar(Veterinario.verificarEmail, email);
    if (existentes.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const result = await ejecutar(Veterinario.crear, {
      nombre,
      email,
      telefono,
      password: await hashearPassword(password),
      especialidad_id,
      numero_licencia
    });
    res.status(201).json({
      message: 'Veterinario creado exitosamente',
      id: result.insertId
    });
  } catch (err) {
    errorServidor(res, 'Error al crear veterinario', err);
  }
};

// Actualizar veterinario
export const actualizarVeterinario = (req, res) => {
  const { id } = req.params;
  const { nombre, email, telefono, especialidad_id, numero_licencia } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({ error: 'Nombre y email son requeridos' });
  }

  const veterinarioData = {
    nombre,
    email,
    telefono,
    especialidad_id,
    numero_licencia
  };

  Veterinario.actualizar(id, veterinarioData, (err, result) => {
    if (err) return errorServidor(res, 'Error al actualizar veterinario', err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Veterinario no encontrado' });
    }
    res.json({ message: 'Veterinario actualizado exitosamente' });
  });
};

// Obtener perfil completo del veterinario
export const obtenerPerfilCompleto = (req, res) => {
  const { id } = req.params;
  Veterinario.obtenerPerfilCompleto(id, (err, veterinario) => {
    if (err) return errorServidor(res, 'Error al obtener perfil del veterinario', err);
    if (veterinario.length === 0) {
      return res.status(404).json({ error: 'Veterinario no encontrado' });
    }
    res.json(veterinario[0]);
  });
};

// Actualizar perfil del veterinario (solo campos editables)
export const actualizarPerfil = (req, res) => {
  const { id } = req.params;
  const { email, telefono } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'El email es requerido' });
  }

  // Verificar si el nuevo email ya existe (excluyendo el veterinario actual)
  Veterinario.verificarEmailExistente(email, id, (err, results) => {
    if (err) return errorServidor(res, 'Error al verificar email', err);
    
    if (results.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado por otro veterinario' });
    }

    const veterinarioData = { email, telefono };

    Veterinario.actualizarPerfil(id, veterinarioData, (err, result) => {
      if (err) return errorServidor(res, 'Error al actualizar perfil', err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Veterinario no encontrado' });
      }
      res.json({ message: 'Perfil actualizado exitosamente' });
    });
  });
};

// Actualizar contraseña del veterinario
export const actualizarPassword = async (req, res) => {
  const { id } = req.params;
  const { passwordActual, nuevaPassword } = req.body ?? {};

  if (!passwordActual || !nuevaPassword) {
    return res.status(400).json({ error: 'Contraseña actual y nueva contraseña son requeridas' });
  }
  if (nuevaPassword.length < PASSWORD_MINIMA) {
    return res.status(400).json({ error: `La contraseña debe tener al menos ${PASSWORD_MINIMA} caracteres` });
  }

  try {
    const [veterinario] = await ejecutar(Veterinario.obtenerPasswordPorId, id);
    if (!veterinario) {
      return res.status(404).json({ error: 'Veterinario no encontrado' });
    }
    if (!(await compararPassword(passwordActual, veterinario.password))) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    await ejecutar(Veterinario.actualizarPassword, id, await hashearPassword(nuevaPassword));
    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (err) {
    errorServidor(res, 'Error al actualizar contraseña', err);
  }
};

// Eliminar (desactivar) veterinario
export const eliminarVeterinario = (req, res) => {
  const { id } = req.params;

  Veterinario.eliminar(id, (err, result) => {
    if (err) return errorServidor(res, 'Error al eliminar veterinario', err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Veterinario no encontrado' });
    }
    res.json({ message: 'Veterinario eliminado exitosamente' });
  });
};