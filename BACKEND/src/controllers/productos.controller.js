import Producto from '../models/productos.model.js';
import { errorServidor } from '../utils/errores.js';

export const obtenerProductos = (req, res) => {
  Producto.obtenerTodos((err, productos) => {
    if (err) {
      return errorServidor(res, 'Error al obtener productos', err);
    }
    res.json(productos);
  });
};

export const traerProductosPorCategoria = (req, res) => {
  const { categoria_id } = req.params;
  Producto.traerPorCategoria(categoria_id, (err, productos) => {
    if (err) {
      return errorServidor(res, 'Error al obtener productos por categoría', err);
    }
    res.json(productos);
  });
};