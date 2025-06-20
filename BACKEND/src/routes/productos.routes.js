import express from 'express';
import { obtenerProductos, traerProductosPorCategoria } from '../controllers/productos.controller.js';

const router = express.Router();

router.get('/', obtenerProductos);

// Obtener productos por categoría
router.get('/categoria/:categoria_id', traerProductosPorCategoria);

export default router;