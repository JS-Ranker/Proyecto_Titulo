import express from 'express';
import {
  traerAdopciones,
  buscarAdopcionPorId,
  crearAdopcion,
  actualizarAdopcion,
  eliminarAdopcion
} from '../controllers/adopciones.controller.js';
import { requiereAuth, soloRol } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', traerAdopciones); // Listar todas
router.get('/:id', buscarAdopcionPorId); // Buscar por id

// Publicar, editar y eliminar: solo el personal de la clínica
router.post('/', requiereAuth, soloRol('veterinario'), crearAdopcion);
router.put('/:id', requiereAuth, soloRol('veterinario'), actualizarAdopcion);
router.delete('/:id', requiereAuth, soloRol('veterinario'), eliminarAdopcion);

export default router;
