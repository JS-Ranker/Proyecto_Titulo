import express from 'express';
import {
  obtenerHistorialPorMascota,
  obtenerMascotasPorVeterinario,
  crearRegistroHistorial,
  obtenerRegistroPorId,
  actualizarRegistroHistorial,
  eliminarRegistroHistorial,
  verificarAccesoVeterinario
} from '../controllers/historialClinico.controller.js';
import { crearSubida, DOCUMENTOS } from '../config/uploads.js';
import { requiereAuth, soloRol, mismoUsuario } from '../middlewares/auth.js';
import { accesoMascota, accesoRegistroHistorial } from '../middlewares/propiedad.js';

const router = express.Router();
const subirAdjunto = crearSubida({ carpeta: 'historial', tipos: DOCUMENTOS });

router.use(requiereAuth);

// Historial completo de una mascota: su dueño o cualquier veterinario
router.get('/mascota/:mascota_id', accesoMascota({ parametro: 'mascota_id', veterinarios: true }), obtenerHistorialPorMascota);

// Mascotas atendidas por el veterinario autenticado
router.get('/veterinario/:veterinario_id/mascotas', mismoUsuario('veterinario', 'veterinario_id'), obtenerMascotasPorVeterinario);

// Crear registro: solo veterinarios (el autor se toma del token)
router.post('/', soloRol('veterinario'), subirAdjunto.single('archivo'), crearRegistroHistorial);

router.get('/:id', accesoRegistroHistorial(), obtenerRegistroPorId);

// Editar o eliminar: solo el veterinario que creó el registro
router.put('/:id', accesoRegistroHistorial({ soloAutor: true }), subirAdjunto.single('archivo'), actualizarRegistroHistorial);
router.delete('/:id', accesoRegistroHistorial({ soloAutor: true }), eliminarRegistroHistorial);

router.get('/acceso/:veterinario_id/:mascota_id', mismoUsuario('veterinario', 'veterinario_id'), verificarAccesoVeterinario);

export default router;
