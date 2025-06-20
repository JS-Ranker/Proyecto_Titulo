import db from '../config/db.js';

const TipoConsulta = {
  traerTodos: (callback) => {
    const sql = 'SELECT * FROM tipos_consulta';
    db.query(sql, callback);
  }
};

export default TipoConsulta; 