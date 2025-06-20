import Producto from '../models/productos.model.js';

export const obtenerProductos = (req, res) => {
  Producto.obtenerTodos((err, productos) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener productos', detalle: err });
    }
    res.json(productos);
  });
};

export const traerProductosPorCategoria = (req, res) => {
  const { categoria_id } = req.params;
  Producto.traerPorCategoria(categoria_id, (err, productos) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener productos por categoría', detalle: err });
    }
    res.json(productos);
  });
};