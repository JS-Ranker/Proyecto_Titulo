import db from '../config/db.js';

const Especie = {
  traerTodas: (callback) => {
    const sql = 'SELECT id, nombre FROM especies WHERE activo = 1';
    db.query(sql, callback);
  }
};

export default Especie;