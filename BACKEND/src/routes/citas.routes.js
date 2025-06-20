import express from 'express';
import { crearCita } from '../controllers/citas.controller.js';

const router = express.Router();

router.post('/', crearCita);

export default router;