import db from '../config/db.js';

const Producto = {
  obtenerTodos: (callback) => {
    const sql = `SELECT * FROM productos WHERE activo = 1`;
    db.query(sql, callback);
  },

  traerPorCategoria: (categoria_id, callback) => {
    const sql = `
      SELECT * FROM productos
      WHERE categoria_id = ? AND activo = 1
      ORDER BY nombre ASC
    `;
    db.query(sql, [categoria_id], callback);
  },
};

export default Producto;