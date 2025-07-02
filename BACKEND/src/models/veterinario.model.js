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

  // Obtener veterinario por ID
  obtenerPorId: (id, callback) => {
    const sql = `
      SELECT id, nombre, email, telefono, especialidad_id, numero_licencia, fecha_registro, activo
      FROM veterinarios
      WHERE id = ?
    `;
    db.query(sql, [id], callback);
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