import db from '../config/db.js';

const Dueno = {
  traer: (callback) => {
    const sql = `
      SELECT rut, nombre, apellido, email, telefono, fecha_registro, activo
      FROM duenos
      ORDER BY rut ASC
    `;
    db.query(sql, callback);
  },

  // `datos.password` debe venir ya hasheado
  crear: (datos, callback) => {
    const sql = `
      INSERT INTO duenos
        (rut, nombre, apellido, email, telefono, password, fecha_registro, activo)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), 1)
    `;
    const params = [
      datos.rut,
      datos.nombre,
      datos.apellido,
      datos.email,
      datos.telefono || null,
      datos.password
    ];
    db.query(sql, params, callback);
  },

  // Datos de contacto; la contraseña se cambia con actualizarPassword
  update: (rut, datos, callback) => {
    const sql = `
      UPDATE duenos
      SET
        nombre = ?,
        apellido = ?,
        email = ?,
        telefono = ?
      WHERE rut = ?
    `;
    const params = [
      datos.nombre,
      datos.apellido,
      datos.email,
      datos.telefono || null,
      rut
    ];
    db.query(sql, params, callback);
  },

  // `hash` debe venir ya hasheado
  actualizarPassword: (rut, hash, callback) => {
    const sql = `UPDATE duenos SET password = ? WHERE rut = ?`;
    db.query(sql, [hash, rut], callback);
  },

  desactivar: (rut, callback) => {
    const sql = `UPDATE duenos SET activo = 0 WHERE rut = ?`;
    db.query(sql, [rut], callback);
  },

  activar: (rut, callback) => {
    const sql = `UPDATE duenos SET activo = 1 WHERE rut = ?`;
    db.query(sql, [rut], callback);
  },

  // Uso interno (login y cambio de contraseña): incluye el hash, nunca se envía al cliente
  buscarPorRut: (rut, callback) => {
    const sql = `SELECT rut, password, activo FROM duenos WHERE rut = ?`;
    db.query(sql, [rut], (err, result) => {
      if (err) return callback(err, null);
      if (result.length === 0) return callback(null, null);
      return callback(null, result[0]);
    });
  },

  buscarDatosPorRut: (rut, callback) => {
    const sql = `
      SELECT rut, nombre, apellido, email, telefono
      FROM duenos
      WHERE rut = ?
    `;
    db.query(sql, [rut], (err, result) => {
      if (err) return callback(err, null);
      if (result.length === 0) return callback(null, null);

      return callback(null, result[0]);
    });
  }
};

export default Dueno;
