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
import { requiereAuth, soloRol, mismoUsuario } from '../middlewares/auth.js';

const router = express.Router();

// Públicas: listados para agendar citas e inicio de sesión
router.get('/especialidad/:especialidad_id', traerVeterinariosPorEspecialidad);
router.post('/login', loginVeterinario);
router.get('/', obtenerVeterinarios);

router.use(requiereAuth);

// Perfil propio
router.get('/perfil/:id', mismoUsuario('veterinario', 'id'), obtenerPerfilCompleto);
router.put('/perfil/:id', mismoUsuario('veterinario', 'id'), actualizarPerfil);
router.put('/password/:id', mismoUsuario('veterinario', 'id'), actualizarPassword);

// Gestión del personal: solo veterinarios (no hay rol de administrador en el sistema)
router.post('/', soloRol('veterinario'), crearVeterinario);
router.get('/:id', soloRol('veterinario'), obtenerVeterinarioPorId);
router.put('/:id', mismoUsuario('veterinario', 'id'), actualizarVeterinario);
router.delete('/:id', mismoUsuario('veterinario', 'id'), eliminarVeterinario);

export default router;
