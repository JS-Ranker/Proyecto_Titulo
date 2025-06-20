import express from 'express';
import { obtenerCitasPorDueno, crearCita, cancelarCita } from '../controllers/citas.controller.js';

const router = express.Router();

router.post('/', crearCita);
router.get('/dueno/:rut', obtenerCitasPorDueno);
router.patch('/:id/cancelar', cancelarCita);

export default router;