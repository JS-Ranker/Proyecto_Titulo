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

  // Obtener citas por veterinario con información completa
  obtenerPorVeterinario: (veterinario_id, callback) => {
    const sql = `
      SELECT 
        c.id,
        c.mascota_id,
        c.veterinario_id,
        c.tipo_consulta_id,
        c.fecha_hora,
        c.duracion_minutos,
        c.motivo,
        c.estado,
        c.notas_previas,
        c.notas_posteriores,
        c.fecha_creacion,
        -- Datos completos de la mascota
        m.nombre_mascota,
        m.id_especie,
        m.id_raza,
        m.fecha_nac_mascota,
        m.peso_kg,
        m.sexo_mascota,
        m.esta_esterilizado,
        m.color_mascota,
        m.codigo_microchip,
        m.url_imagen_mascota,
        -- Datos del dueño
        d.rut AS dueno_rut,
        d.nombre AS dueno_nombre,
        d.apellido AS dueno_apellido,
        d.telefono AS dueno_telefono,
        d.email AS dueno_email,
        -- Nombres de relaciones
        tc.nombre AS tipo_consulta,
        e.nombre AS especie_nombre,
        r.nombre AS raza_nombre
      FROM citas c
      LEFT JOIN mascotas m ON c.mascota_id = m.id_mascota
      LEFT JOIN duenos d ON m.id_dueno = d.rut
      LEFT JOIN tipos_consulta tc ON c.tipo_consulta_id = tc.id
      LEFT JOIN especies e ON m.id_especie = e.id
      LEFT JOIN razas r ON m.id_raza = r.id
      WHERE c.veterinario_id = ?
      ORDER BY c.fecha_hora ASC
    `;
    db.query(sql, [veterinario_id], callback);
  },

  // Obtener citas del día para un veterinario con información completa
  obtenerCitasDelDia: (veterinario_id, fecha, callback) => {
    const sql = `
      SELECT 
        c.id,
        c.mascota_id,
        c.veterinario_id,
        c.tipo_consulta_id,
        c.fecha_hora,
        c.duracion_minutos,
        c.motivo,
        c.estado,
        c.notas_previas,
        c.notas_posteriores,
        c.fecha_creacion,
        -- Datos completos de la mascota
        m.nombre_mascota,
        m.id_especie,
        m.id_raza,
        m.fecha_nac_mascota,
        m.peso_kg,
        m.sexo_mascota,
        m.esta_esterilizado,
        m.color_mascota,
        m.codigo_microchip,
        m.url_imagen_mascota,
        -- Datos del dueño
        d.rut AS dueno_rut,
        d.nombre AS dueno_nombre,
        d.apellido AS dueno_apellido,
        d.telefono AS dueno_telefono,
        d.email AS dueno_email,
        -- Nombres de relaciones
        tc.nombre AS tipo_consulta,
        e.nombre AS especie_nombre,
        r.nombre AS raza_nombre
      FROM citas c
      LEFT JOIN mascotas m ON c.mascota_id = m.id_mascota
      LEFT JOIN duenos d ON m.id_dueno = d.rut
      LEFT JOIN tipos_consulta tc ON c.tipo_consulta_id = tc.id
      LEFT JOIN especies e ON m.id_especie = e.id
      LEFT JOIN razas r ON m.id_raza = r.id
      WHERE c.veterinario_id = ? 
        AND DATE(c.fecha_hora) = ?
      ORDER BY c.fecha_hora ASC
    `;
    db.query(sql, [veterinario_id, fecha], callback);
  },

  // Obtener estadísticas para el veterinario
  obtenerEstadisticasVeterinario: (veterinario_id, callback) => {
    const sql = `
      SELECT 
        COUNT(*) as total_citas,
        SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as citas_pendientes,
        SUM(CASE WHEN estado = 'completada' THEN 1 ELSE 0 END) as citas_completadas,
        SUM(CASE WHEN estado = 'cancelada' THEN 1 ELSE 0 END) as citas_canceladas,
        SUM(CASE WHEN DATE(fecha_hora) = CURDATE() THEN 1 ELSE 0 END) as citas_hoy
      FROM citas 
      WHERE veterinario_id = ?
    `;
    db.query(sql, [veterinario_id], callback);
  },

  // Actualizar estado de cita
  actualizarEstado: (id, estado, callback) => {
    const sql = `UPDATE citas SET estado = ? WHERE id = ?`;
    db.query(sql, [estado, id], callback);
  },

  // Completar cita con notas posteriores
  completarCita: (id, notas_posteriores, callback) => {
    const sql = `
      UPDATE citas 
      SET estado = 'completada', 
          notas_posteriores = ?
      WHERE id = ?
    `;
    db.query(sql, [notas_posteriores, id], callback);
  },

  // Cancelar cita con motivo
  cancelarCita: (id, motivo_cancelacion, callback) => {
    const sql = `
      UPDATE citas 
      SET estado = 'cancelada', 
          notas_posteriores = CONCAT(IFNULL(notas_posteriores, ''), 
                                    CASE WHEN notas_posteriores IS NOT NULL 
                                    THEN CONCAT('\n--- CANCELACIÓN ---\n', ?) 
                                    ELSE CONCAT('CANCELACIÓN: ', ?) END)
      WHERE id = ?
    `;
    db.query(sql, [motivo_cancelacion, motivo_cancelacion, id], callback);
  },

  // Actualizar notas previas de la cita
  actualizarNotasPrevias: (id, notas_previas, callback) => {
    const sql = `UPDATE citas SET notas_previas = ? WHERE id = ?`;
    db.query(sql, [notas_previas, id], callback);
  },

  // Obtener detalles completos de una cita específica
  obtenerDetalleCita: (id, callback) => {
    const sql = `
      SELECT 
        c.id,
        c.mascota_id,
        c.veterinario_id,
        c.tipo_consulta_id,
        c.fecha_hora,
        c.duracion_minutos,
        c.motivo,
        c.estado,
        c.notas_previas,
        c.notas_posteriores,
        c.fecha_creacion,
        -- Datos completos de la mascota
        m.nombre_mascota,
        m.id_especie,
        m.id_raza,
        m.fecha_nac_mascota,
        m.peso_kg,
        m.sexo_mascota,
        m.esta_esterilizado,
        m.color_mascota,
        m.codigo_microchip,
        m.url_imagen_mascota,
        -- Datos del dueño
        d.rut AS dueno_rut,
        d.nombre AS dueno_nombre,
        d.apellido AS dueno_apellido,
        d.telefono AS dueno_telefono,
        d.email AS dueno_email,
        -- Nombres de relaciones
        tc.nombre AS tipo_consulta,
        e.nombre AS especie_nombre,
        r.nombre AS raza_nombre,
        -- Datos del veterinario
        v.nombre AS veterinario_nombre
      FROM citas c
      LEFT JOIN mascotas m ON c.mascota_id = m.id_mascota
      LEFT JOIN duenos d ON m.id_dueno = d.rut
      LEFT JOIN tipos_consulta tc ON c.tipo_consulta_id = tc.id
      LEFT JOIN especies e ON m.id_especie = e.id
      LEFT JOIN razas r ON m.id_raza = r.id
      LEFT JOIN veterinarios v ON c.veterinario_id = v.id
      WHERE c.id = ?
    `;
    db.query(sql, [id], callback);
  }
};

export default Cita;