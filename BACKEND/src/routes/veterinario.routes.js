import express from 'express';
import { 
  traerVeterinariosPorEspecialidad,
  loginVeterinario,
  obtenerVeterinarios,
  obtenerVeterinarioPorId,
  obtenerPerfilCompleto,
  crearVeterinario,
  actualizarVeterinario,
  actualizarPerfil,
  actualizarPassword,
  eliminarVeterinario
} from '../controllers/veterinario.controller.js';

const router = express.Router();

// Rutas existentes
router.get('/especialidad/:especialidad_id', traerVeterinariosPorEspecialidad);

// Rutas de autenticación
router.post('/login', loginVeterinario);

// Rutas CRUD básicas
router.get('/', obtenerVeterinarios);
router.get('/:id', obtenerVeterinarioPorId);
router.post('/', crearVeterinario);
router.put('/:id', actualizarVeterinario);
router.delete('/:id', eliminarVeterinario);

// Rutas específicas para perfil
router.get('/perfil/:id', obtenerPerfilCompleto);
router.put('/perfil/:id', actualizarPerfil);
router.put('/password/:id', actualizarPassword);

export default router;