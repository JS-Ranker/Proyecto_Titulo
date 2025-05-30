import db from '../config/db.js';

const Raza = {
  traerTodas: (callback) => {
    const sql = 'SELECT * FROM razas';
    db.query(sql, callback);
  },
  traerPorEspecie: (especie_id, callback) => {
    const sql = 'SELECT * FROM razas WHERE especie_id = ?';
    db.query(sql, [especie_id], callback);
  },
  traerPorId: (id, callback) => {
    const sql = 'SELECT * FROM razas WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) return callback(err, null);
      if (result.length === 0) return callback(null, null);
      return callback(null, result[0]);
    });
  }
};

export default Raza;