import express from 'express';
import { traerRazas, traerRazasPorEspecie, traerRazaPorId } from '../controllers/razas.controller.js';

const router = express.Router();

router.get('/', traerRazas); // Todas las razas
router.get('/especie/:especie_id', traerRazasPorEspecie); // Razas por especie
router.get('/:id', traerRazaPorId); // Raza por id

export default router;