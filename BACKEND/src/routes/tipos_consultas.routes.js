import express from 'express';
import { traerTiposConsulta } from '../controllers/tipos_consultas.controller.js';

const router = express.Router();
router.get('/', traerTiposConsulta);

export default router;