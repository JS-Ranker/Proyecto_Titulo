import db from '../config/db.js';

const Cita = {
  crear: (datos, callback) => {
    const sql = `
      INSERT INTO citas
        (mascota_id, veterinario_id, tipo_consulta_id, fecha_hora, duracion_minutos, motivo, estado, notas_previas)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      datos.mascota_id,
      datos.veterinario_id || null,
      datos.tipo_consulta_id || null,
      datos.fecha_hora,
      datos.duracion_minutos || 30,
      datos.motivo || null,
      datos.estado || 'pendiente',
      datos.notas_previas || null
    ];
    db.query(sql, params, callback);
  },
  obtenerPorMascotas: (ids, callback) => {
    if (!ids.length) return callback(null, []);
    const placeholders = ids.map(() => '?').join(',');
    const sql = `
      SELECT c.*, m.nombre_mascota, t.nombre AS tipo_consulta, v.nombre AS veterinario
      FROM citas c
      LEFT JOIN mascotas m ON c.mascota_id = m.id_mascota
      LEFT JOIN tipos_consulta t ON c.tipo_consulta_id = t.id
      LEFT JOIN veterinarios v ON c.veterinario_id = v.id
      WHERE c.mascota_id IN (${placeholders})
      ORDER BY c.fecha_hora DESC
    `;
    db.query(sql, ids, callback);
  },
  actualizarEstado: (id, estado, callback) => {
    const sql = `UPDATE citas SET estado = ? WHERE id = ?`;
    db.query(sql, [estado, id], callback);
  },
};

export default Cita;