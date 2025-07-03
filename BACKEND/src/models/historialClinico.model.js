import db from '../config/db.js';

const HistorialClinico = {
  // Obtener historial completo por mascota
  obtenerPorMascota: (mascota_id, callback) => {
    const sql = `
      SELECT 
        hc.id,
        hc.mascota_id,
        hc.fecha,
        hc.tipo,
        hc.descripcion,
        hc.veterinario_id,
        hc.archivos_adjuntos,
        v.nombre as veterinario_nombre,
        m.nombre_mascota,
        m.id_dueno
      FROM historial_clinico hc
      LEFT JOIN veterinarios v ON hc.veterinario_id = v.id
      LEFT JOIN mascotas m ON hc.mascota_id = m.id_mascota
      WHERE hc.mascota_id = ?
      ORDER BY hc.fecha DESC
    `;
    db.query(sql, [mascota_id], callback);
  },

  // Obtener historial por veterinario (mascotas que ha atendido)
  obtenerPorVeterinario: (veterinario_id, callback) => {
    const sql = `
      SELECT DISTINCT
        m.id_mascota,
        m.nombre_mascota,
        m.url_imagen_mascota,
        d.nombre as dueno_nombre,
        d.apellido as dueno_apellido,
        COUNT(hc.id) as total_consultas,
        MAX(hc.fecha) as ultima_consulta
      FROM historial_clinico hc
      JOIN mascotas m ON hc.mascota_id = m.id_mascota
      JOIN duenos d ON m.id_dueno = d.rut
      WHERE hc.veterinario_id = ?
      GROUP BY m.id_mascota, m.nombre_mascota, m.url_imagen_mascota, d.nombre, d.apellido
      ORDER BY MAX(hc.fecha) DESC
    `;
    db.query(sql, [veterinario_id], callback);
  },

  // Crear nuevo registro de historial
  crear: (datos, callback) => {
    const sql = `
      INSERT INTO historial_clinico 
        (mascota_id, fecha, tipo, descripcion, veterinario_id, archivos_adjuntos)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      datos.mascota_id,
      datos.fecha || new Date(),
      datos.tipo,
      datos.descripcion,
      datos.veterinario_id,
      datos.archivos_adjuntos || null
    ];
    db.query(sql, params, callback);
  },

  // Obtener un registro específico
  obtenerPorId: (id, callback) => {
    const sql = `
      SELECT 
        hc.id,
        hc.mascota_id,
        hc.fecha,
        hc.tipo,
        hc.descripcion,
        hc.veterinario_id,
        hc.archivos_adjuntos,
        v.nombre as veterinario_nombre,
        m.nombre_mascota,
        m.id_dueno
      FROM historial_clinico hc
      LEFT JOIN veterinarios v ON hc.veterinario_id = v.id
      LEFT JOIN mascotas m ON hc.mascota_id = m.id_mascota
      WHERE hc.id = ?
    `;
    db.query(sql, [id], callback);
  },

  // Actualizar registro existente
  actualizar: (id, datos, callback) => {
    const sql = `
      UPDATE historial_clinico 
      SET fecha = ?, tipo = ?, descripcion = ?, archivos_adjuntos = ?
      WHERE id = ?
    `;
    const params = [
      datos.fecha,
      datos.tipo,
      datos.descripcion,
      datos.archivos_adjuntos,
      id
    ];
    db.query(sql, params, callback);
  },

  // Eliminar registro (soft delete o hard delete según necesidad)
  eliminar: (id, callback) => {
    const sql = `DELETE FROM historial_clinico WHERE id = ?`;
    db.query(sql, [id], callback);
  },

  // Verificar si veterinario puede acceder al historial de una mascota
  verificarAccesoVeterinario: (veterinario_id, mascota_id, callback) => {
    const sql = `
      SELECT COUNT(*) as count 
      FROM historial_clinico 
      WHERE veterinario_id = ? AND mascota_id = ?
    `;
    db.query(sql, [veterinario_id, mascota_id], callback);
  }
};

export default HistorialClinico;
