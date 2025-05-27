import express from 'express';
import {
  traerMascotas,
  crearMascota,
  actualizarMascota,
  desactivarMascota,
  activarMascota,
  buscarMascotaPorId,
  buscarMascotasPorDueno
} from '../controllers/mascotas.controller.js';

const router = express.Router();

router.get('/', traerMascotas); // Obtener todas las mascotas activas
router.post('/', crearMascota); // Crear nueva mascota
router.put('/:id', actualizarMascota); // Actualizar mascota por id
router.patch('/desactivar/:id', desactivarMascota); // Desactivar mascota (estado_activo=0)
router.patch('/activar/:id', activarMascota); // Activar mascota (estado_activo=1)
router.get('/:id', buscarMascotaPorId); // Buscar mascota por id
router.get('/dueno/:id_dueno', buscarMascotasPorDueno); // Buscar mascotas activas por id_dueno

export default router;
