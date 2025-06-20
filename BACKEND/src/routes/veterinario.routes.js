import express from 'express';
import { traerVeterinariosPorEspecialidad } from '../controllers/veterinario.controller.js';

const router = express.Router();
router.get('/especialidad/:especialidad_id', traerVeterinariosPorEspecialidad);

export default router;