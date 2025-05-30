import express from 'express';
import { traerEspecies } from '../controllers/especies.controller.js';

const router = express.Router();

router.get('/', traerEspecies);

export default router;