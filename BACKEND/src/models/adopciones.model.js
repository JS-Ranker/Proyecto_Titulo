import db from '../config/db.js';

const Adopcion = {
  traer: (callback) => {
    const sql = 'SELECT * FROM adopciones ORDER BY fecha_publicacion DESC';
    db.query(sql, callback);
  },

  buscarPorId: (id, callback) => {
    const sql = 'SELECT * FROM adopciones WHERE id = ?';
    db.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  crear: (datos, callback) => {
    const sql = `INSERT INTO adopciones (
      titulo, descripcion, requisitos, contacto_nombre, contacto_email, contacto_telefono, ubicacion, fecha_publicacion, estado,
      nombre_mascota, especie, edad, sexo, imagen_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?)`;
    const params = [
      datos.titulo,
      datos.descripcion,
      datos.requisitos || null,
      datos.contacto_nombre,
      datos.contacto_email,
      datos.contacto_telefono || null,
      datos.ubicacion || null,
      datos.estado || 'disponible',
      datos.nombre_mascota,
      datos.especie,
      datos.edad || null,
      datos.sexo || null,
      datos.imagen_url || null
    ];
    db.query(sql, params, callback);
  },

  actualizar: (id, datos, callback) => {
    const sql = `UPDATE adopciones SET 
      titulo=?, descripcion=?, requisitos=?, contacto_nombre=?, contacto_email=?, contacto_telefono=?, ubicacion=?, estado=?,
      nombre_mascota=?, especie=?, edad=?, sexo=?, imagen_url=?
      WHERE id=?`;
    const params = [
      datos.titulo,
      datos.descripcion,
      datos.requisitos || null,
      datos.contacto_nombre,
      datos.contacto_email,
      datos.contacto_telefono || null,
      datos.ubicacion || null,
      datos.estado || 'disponible',
      datos.nombre_mascota,
      datos.especie,
      datos.edad || null,
      datos.sexo || null,
      datos.imagen_url || null,
      id
    ];
    db.query(sql, params, callback);
  },

  eliminar: (id, callback) => {
    const sql = 'DELETE FROM adopciones WHERE id = ?';
    db.query(sql, [id], callback);
  }
};

export default Adopcion;
