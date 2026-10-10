import express from 'express';
import {
  loginDueno,
  TraerDuenos,
  CrearDueno,
  ActualizarDueno,
  DesactivarDueno,
  activarDueno,
  TraerDuenoPorRut,
} from '../controllers/duenos.controller.js';
import { requiereAuth, soloRol, mismoUsuario, mismoDuenoOVeterinario } from '../middlewares/auth.js';

const router = express.Router();

// Públicas: registro e inicio de sesión
router.post('/', CrearDueno);
router.post('/login', loginDueno);

router.use(requiereAuth);

router.get('/', soloRol('veterinario'), TraerDuenos);
router.get('/:rut', mismoDuenoOVeterinario('rut'), TraerDuenoPorRut);
router.put('/:rut', mismoUsuario('dueno', 'rut'), ActualizarDueno);
router.put('/desactivar/:rut', mismoDuenoOVeterinario('rut'), DesactivarDueno);
router.put('/activar/:rut', soloRol('veterinario'), activarDueno);

export default router;
