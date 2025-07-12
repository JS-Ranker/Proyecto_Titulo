import db from '../config/db.js';

const Veterinario = {
  traerPorEspecialidad: (especialidad_id, callback) => {
    const sql = `
      SELECT id, nombre, email, telefono, especialidad_id, numero_licencia
      FROM veterinarios
      WHERE especialidad_id = ? AND activo = 1
    `;
    db.query(sql, [especialidad_id], callback);
  },

  // Login de veterinario - obtener todos los campos necesarios
  loginVeterinario: (email, callback) => {
    const sql = `
      SELECT id, nombre, email, telefono, password, especialidad_id, numero_licencia, fecha_registro, activo
      FROM veterinarios
      WHERE email = ? AND activo = 1
    `;
    db.query(sql, [email], callback);
  },

  // Obtener todos los veterinarios
  obtenerTodos: (callback) => {
    const sql = `
      SELECT id, nombre, email, telefono, especialidad_id, numero_licencia, fecha_registro, activo
      FROM veterinarios
      ORDER BY nombre
    `;
    db.query(sql, callback);
  },

  // Obtener veterinario por ID con información de especialidad
  obtenerPerfilCompleto: (id, callback) => {
    const sql = `
      SELECT 
        v.id, 
        v.nombre, 
        v.email, 
        v.telefono, 
        v.password,
        v.especialidad_id, 
        v.numero_licencia, 
        v.fecha_registro, 
        v.activo,
        e.nombre as nombre_especialidad,
        e.descripcion as descripcion_especialidad
      FROM veterinarios v
      LEFT JOIN especialidades e ON v.especialidad_id = e.id
      WHERE v.id = ?
    `;
    db.query(sql, [id], callback);
  },

  // Actualizar perfil de veterinario (solo campos editables)
  actualizarPerfil: (id, veterinarioData, callback) => {
    const sql = `
      UPDATE veterinarios
      SET email = ?, telefono = ?
      WHERE id = ?
    `;
    const { email, telefono } = veterinarioData;
    db.query(sql, [email, telefono, id], callback);
  },

  // Actualizar contraseña de veterinario
  actualizarPassword: (id, hashedPassword, callback) => {
    const sql = `
      UPDATE veterinarios
      SET password = ?
      WHERE id = ?
    `;
    db.query(sql, [hashedPassword, id], callback);
  },

  // Verificar si el email existe (excluyendo el veterinario actual)
  verificarEmailExistente: (email, veterinarioId, callback) => {
    const sql = `
      SELECT id FROM veterinarios WHERE email = ? AND id != ?
    `;
    db.query(sql, [email, veterinarioId], callback);
  },

  // Crear nuevo veterinario
  crear: (veterinarioData, callback) => {
    const sql = `
      INSERT INTO veterinarios (nombre, email, telefono, password, especialidad_id, numero_licencia)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const { nombre, email, telefono, password, especialidad_id, numero_licencia } = veterinarioData;
    db.query(sql, [nombre, email, telefono, password, especialidad_id, numero_licencia], callback);
  },

  // Actualizar veterinario
  actualizar: (id, veterinarioData, callback) => {
    const sql = `
      UPDATE veterinarios
      SET nombre = ?, email = ?, telefono = ?, especialidad_id = ?, numero_licencia = ?
      WHERE id = ?
    `;
    const { nombre, email, telefono, especialidad_id, numero_licencia } = veterinarioData;
    db.query(sql, [nombre, email, telefono, especialidad_id, numero_licencia, id], callback);
  },

  // Eliminar (desactivar) veterinario
  eliminar: (id, callback) => {
    const sql = `
      UPDATE veterinarios
      SET activo = 0
      WHERE id = ?
    `;
    db.query(sql, [id], callback);
  },

  // Verificar si el email existe
  verificarEmail: (email, callback) => {
    const sql = `
      SELECT id FROM veterinarios WHERE email = ?
    `;
    db.query(sql, [email], callback);
  }
};

export default Veterinario;