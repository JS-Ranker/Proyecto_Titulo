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

const router = express.Router();

// Rutas existentes
router.post('/', crearCita);
router.get('/dueno/:rut', obtenerCitasPorDueno);
router.patch('/:id/cancelar', cancelarCita);

// Rutas para veterinarios
router.get('/veterinario/:veterinario_id', obtenerCitasPorVeterinario);
router.get('/veterinario/:veterinario_id/dia', obtenerCitasDelDia);
router.get('/veterinario/:veterinario_id/estadisticas', obtenerEstadisticasVeterinario);

// Rutas para gestión de citas por veterinarios
router.patch('/:id/completar', completarCita);
router.patch('/:id/cancelar-motivo', cancelarCitaConMotivo);
router.patch('/:id/estado', actualizarEstadoCita);

export default router;