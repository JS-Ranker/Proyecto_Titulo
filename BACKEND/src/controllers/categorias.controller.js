import db from '../config/db.js';
import { errorServidor } from '../utils/errores.js';

export const obtenerCategorias = (req, res) => {
  db.query('SELECT * FROM categorias_productos ORDER BY nombre ASC', (err, results) => {
    if (err) {
      return errorServidor(res, 'Error al obtener categorías', err);
    }
    res.json(results);
  });
};