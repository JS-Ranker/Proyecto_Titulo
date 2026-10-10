import express from 'express';
import {
  obtenerCitasPorDueno,
  crearCita,
  cancelarCita,
  obtenerCitasPorVeterinario,
  obtenerCitasDelDia,
  obtenerEstadisticasVeterinario,
  completarCita,
  cancelarCitaConMotivo,
  actualizarEstadoCita
} from '../controllers/citas.controller.js';
import { requiereAuth, soloRol, mismoUsuario } from '../middlewares/auth.js';
import { accesoCita } from '../middlewares/propiedad.js';

const router = express.Router();

router.use(requiereAuth);

// Dueños
router.post('/', soloRol('dueno'), crearCita); // La mascota debe ser del dueño (se valida en el controlador)
router.get('/dueno/:rut', mismoUsuario('dueno', 'rut'), obtenerCitasPorDueno);
router.patch('/:id/cancelar', accesoCita({ dueno: true }), cancelarCita); // Dueño de la mascota o veterinario asignado

// Veterinarios: solo sus propias citas
router.get('/veterinario/:veterinario_id', mismoUsuario('veterinario', 'veterinario_id'), obtenerCitasPorVeterinario);
router.get('/veterinario/:veterinario_id/dia', mismoUsuario('veterinario', 'veterinario_id'), obtenerCitasDelDia);
router.get('/veterinario/:veterinario_id/estadisticas', mismoUsuario('veterinario', 'veterinario_id'), obtenerEstadisticasVeterinario);
router.patch('/:id/completar', accesoCita(), completarCita);
router.patch('/:id/cancelar-motivo', accesoCita(), cancelarCitaConMotivo);
router.patch('/:id/estado', accesoCita(), actualizarEstadoCita);

export default router;
