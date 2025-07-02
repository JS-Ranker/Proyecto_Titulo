import express from 'express';
import { 
  traerVeterinariosPorEspecialidad,
  loginVeterinario,
  obtenerVeterinarios,
  obtenerVeterinarioPorId,
  crearVeterinario,
  actualizarVeterinario,
  eliminarVeterinario
} from '../controllers/veterinario.controller.js';

const router = express.Router();

// Rutas existentes
router.get('/especialidad/:especialidad_id', traerVeterinariosPorEspecialidad);

// Nuevas rutas CRUD
router.post('/login', loginVeterinario);
router.get('/', obtenerVeterinarios);
router.get('/:id', obtenerVeterinarioPorId);
router.post('/', crearVeterinario);
router.put('/:id', actualizarVeterinario);
router.delete('/:id', eliminarVeterinario);

export default router;