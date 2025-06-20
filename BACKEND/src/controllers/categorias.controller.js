import db from '../config/db.js';

export const obtenerCategorias = (req, res) => {
  db.query('SELECT * FROM categorias_productos ORDER BY nombre ASC', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener categorías', detalle: err });
    }
    res.json(results);
  });
};