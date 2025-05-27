import db from '../config/db.js';

const Dueno = {
  traer: (callback) => {
    const sql = `
      SELECT rut, nombre, apellido, email, telefono, password, fecha_registro, activo
      FROM duenos
      ORDER BY rut ASC
    `;
    db.query(sql, callback);
  },

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
 
  update: (rut, datos, callback) => {
    const sql = `
      UPDATE duenos
      SET
        nombre = ?,
        apellido = ?,
        email = ?,
        telefono = ?,
        password = ?
      WHERE rut = ?
    `;
    const params = [
      datos.nombre,
      datos.apellido,
      datos.email,
      datos.telefono || null,
      datos.password,
      rut
    ];
    db.query(sql, params, callback);
  },

  desactivar: (rut, callback) => {
    const sql = `UPDATE duenos SET activo = 0 WHERE rut = ?`;
    db.query(sql, [rut], callback);
  },

  activar: (rut, callback) => {
    const sql = `UPDATE duenos SET activo = 1 WHERE rut = ?`;
    db.query(sql, [rut], callback);
  },

  buscarPorRut: (rut, callback) => {
    const sql = `SELECT rut, password, activo FROM duenos WHERE rut = ?`;
    db.query(sql, [rut], (err, result) => {
      if (err) return callback(err, null);
      if (result.length === 0) return callback(null, null);
      return callback(null, result[0]);
    });
  },

  buscarDatosPorRut: (rut, callback) => {
    const sqlDueno = `
      SELECT rut, nombre, apellido, email, telefono
      FROM duenos
      WHERE rut = ?
    `;
    db.query(sqlDueno, [rut], (err, result) => {
      if (err) return callback(err, null);
      if (result.length === 0) return callback(null, null);

      // Ahora buscamos las mascotas de este dueño
      const dueno = result[0];
      const sqlPets = `
        SELECT id, name, type, age
        FROM mascotas
        WHERE rut_dueno = ?
      `;
      db.query(sqlPets, [rut], (err2, pets) => {
        if (err2) return callback(err2, null);
        dueno.pets = pets || [];
        return callback(null, dueno);
      });
    });
  }
};

export default Dueno;
