import express from 'express';
import {
  traerAdopciones,
  buscarAdopcionPorId,
  crearAdopcion,
  actualizarAdopcion,
  eliminarAdopcion
} from '../controllers/adopciones.controller.js';

const router = express.Router();

router.get('/', traerAdopciones); // Listar todas
router.get('/:id', buscarAdopcionPorId); // Buscar por id
router.post('/', crearAdopcion); // Crear
router.put('/:id', actualizarAdopcion); // Actualizar
router.delete('/:id', eliminarAdopcion); // Eliminar

export default router;
