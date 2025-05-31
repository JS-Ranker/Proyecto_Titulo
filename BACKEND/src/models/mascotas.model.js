import db from '../config/db.js';

const Mascota = {
  traer: (callback) => {
    const sql = `
      SELECT 
        m.id_mascota,
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
        m.id_dueno,
        m.fecha_registro_mascota,
        m.estado_activo,
        d.nombre as dueno_nombre,
        d.apellido as dueno_apellido
      FROM mascotas m
      LEFT JOIN duenos d ON m.id_dueno = d.rut
      WHERE m.estado_activo = 1
      ORDER BY m.id_mascota ASC
    `;
    db.query(sql, callback);
  },

  crear: (datos, callback) => {
    const sql = `
      INSERT INTO mascotas
        (nombre_mascota, id_especie, id_raza, fecha_nac_mascota, peso_kg, sexo_mascota, 
         esta_esterilizado, color_mascota, codigo_microchip, url_imagen_mascota, id_dueno, fecha_registro_mascota, estado_activo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 1)
    `;
    const params = [
      datos.nombre_mascota,
      Number(datos.id_especie) || null,
      Number(datos.id_raza) || null,
      datos.fecha_nac_mascota || null,
      datos.peso_kg ? Number(datos.peso_kg) : null,
      // Asegúrate que sea 'macho', 'hembra' o 'desconocido'
      ['macho', 'hembra', 'desconocido'].includes(datos.sexo_mascota)
        ? datos.sexo_mascota
        : 'desconocido',
      datos.esta_esterilizado === '1' || datos.esta_esterilizado === 1 ? 1 : 0,
      datos.color_mascota || null,
      datos.codigo_microchip || null,
      datos.url_imagen_mascota || null,
      datos.id_dueno
    ];
    db.query(sql, params, callback);
  },

  update: (id, datos, callback) => {
    const sql = `
      UPDATE mascotas
      SET
        nombre_mascota = ?,
        id_especie = ?,
        id_raza = ?,
        fecha_nac_mascota = ?,
        peso_kg = ?,
        sexo_mascota = ?,
        esta_esterilizado = ?,
        color_mascota = ?,
        codigo_microchip = ?,
        url_imagen_mascota = ?
      WHERE id_mascota = ?
    `;
    const params = [
      datos.nombre_mascota,
      datos.id_especie || null,
      datos.id_raza || null,
      datos.fecha_nac_mascota || null,
      datos.peso_kg || null,
      datos.sexo_mascota || 'desconocido',
      datos.esta_esterilizado || 0,
      datos.color_mascota || null,
      datos.codigo_microchip || null,
      datos.url_imagen_mascota || null,
      id
    ];
    db.query(sql, params, callback);
  },

  desactivar: (id, callback) => {
    const sql = `UPDATE mascotas SET estado_activo = 0 WHERE id_mascota = ?`;
    db.query(sql, [id], callback);
  },

  activar: (id, callback) => {
    const sql = `UPDATE mascotas SET estado_activo = 1 WHERE id_mascota = ?`;
    db.query(sql, [id], callback);
  },

  desactivarPorDueno: (id_dueno, callback) => {
    const sql = `UPDATE mascotas SET estado_activo = 0 WHERE id_dueno = ?`;
    db.query(sql, [id_dueno], callback);
  },

  activarPorDueno: (id_dueno, callback) => {
    const sql = `UPDATE mascotas SET estado_activo = 1 WHERE id_dueno = ?`;
    db.query(sql, [id_dueno], callback);
  },

  buscarPorId: (id, callback) => {
    const sql = `
      SELECT 
        m.id_mascota,
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
        m.id_dueno,
        m.fecha_registro_mascota,
        m.estado_activo,
        d.nombre as dueno_nombre,
        d.apellido as dueno_apellido
      FROM mascotas m
      LEFT JOIN duenos d ON m.id_dueno = d.rut
      WHERE m.id_mascota = ?
    `;
    db.query(sql, [id], (err, result) => {
      if (err) return callback(err, null);
      if (result.length === 0) return callback(null, null);
      return callback(null, result[0]);
    });
  },

  buscarPorDueno: (id_dueno, callback) => {
    const sql = `
      SELECT 
        m.id_mascota,
        m.nombre_mascota,
        m.id_especie,
        e.nombre AS nombre_especie,
        m.id_raza,
        r.nombre AS nombre_raza,
        m.fecha_nac_mascota,
        m.peso_kg,
        m.sexo_mascota,
        m.esta_esterilizado,
        m.color_mascota,
        m.codigo_microchip,
        m.url_imagen_mascota,
        m.id_dueno,
        m.fecha_registro_mascota,
        m.estado_activo
      FROM mascotas m
      LEFT JOIN especies e ON m.id_especie = e.id
      LEFT JOIN razas r ON m.id_raza = r.id
      WHERE m.id_dueno = ? AND m.estado_activo = 1
      ORDER BY m.nombre_mascota ASC
    `;
    db.query(sql, [id_dueno], callback);
  },

  activarPorId: (id_mascota, callback) => {
    const sql = `UPDATE mascotas SET estado_activo = 1 WHERE id_mascota = ?`;
    db.query(sql, [id_mascota], callback);
  },
};

export default Mascota;
