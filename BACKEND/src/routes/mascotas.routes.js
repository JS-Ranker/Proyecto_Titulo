import express from 'express';
import {
  traerMascotas,
  crearMascota,
  actualizarMascota,
  desactivarMascota,
  activarMascota,
  buscarMascotaPorId,
  buscarMascotasPorDueno,
  desactivarMascotasPorDueno,
  activarMascotasPorDueno,
  obtenerDatosCompletos
} from '../controllers/mascotas.controller.js';
import { crearSubida, IMAGENES } from '../config/uploads.js';
import { requiereAuth, soloRol, mismoUsuario, mismoDuenoOVeterinario } from '../middlewares/auth.js';
import { accesoMascota } from '../middlewares/propiedad.js';

const router = express.Router();
const subirImagen = crearSubida({ carpeta: 'mascotas', tipos: IMAGENES, maxMB: 5 });

router.use(requiereAuth);

router.get('/', soloRol('veterinario'), traerMascotas); // Todas las mascotas activas (personal de la clínica)
router.post('/', soloRol('dueno'), subirImagen.single('imagen'), crearMascota); // El dueño se toma del token
router.put('/:id', accesoMascota(), actualizarMascota);
router.patch('/desactivar/:id', accesoMascota(), desactivarMascota);
router.patch('/activar/:id', accesoMascota(), activarMascota);
router.get('/completos/:id', accesoMascota({ veterinarios: true }), obtenerDatosCompletos);
router.get('/dueno/:id_dueno', mismoDuenoOVeterinario('id_dueno'), buscarMascotasPorDueno);
router.patch('/desactivar/dueno/:id_dueno', mismoUsuario('dueno', 'id_dueno'), desactivarMascotasPorDueno);
router.patch('/activar/dueno/:id_dueno', mismoUsuario('dueno', 'id_dueno'), activarMascotasPorDueno);
router.get('/:id', accesoMascota({ veterinarios: true }), buscarMascotaPorId);

export default router;
