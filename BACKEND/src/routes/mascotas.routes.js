import express from 'express';
import multer from 'multer';
import {
  traerMascotas,
  crearMascota,
  actualizarMascota,
  desactivarMascota,
  activarMascota,
  buscarMascotaPorId,
  buscarMascotasPorDueno,
  desactivarMascotasPorDueno,
  activarMascotasPorDueno
} from '../controllers/mascotas.controller.js';

const router = express.Router();

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/mascotas/');
  },
  filename: function (req, file, cb) {
    // Nombre único: fecha + nombre original
    const uniqueSuffix = Date.now() + '-' + file.originalname.replace(/\s/g, '');
    cb(null, uniqueSuffix);
  }
});
const upload = multer({ storage });

router.get('/', traerMascotas); // Obtener todas las mascotas activas
router.post('/', upload.single('imagen'), crearMascota); // Crear nueva mascota con imagen
router.put('/:id', actualizarMascota); // Actualizar mascota por id
router.patch('/desactivar/:id', desactivarMascota); // Desactivar mascota (estado_activo=0)
router.patch('/activar/:id', activarMascota); // Activar mascota (estado_activo=1)
router.get('/:id', buscarMascotaPorId); // Buscar mascota por id
router.get('/dueno/:id_dueno', buscarMascotasPorDueno); // Buscar mascotas activas por id_dueno
router.patch('/desactivar/dueno/:id_dueno', desactivarMascotasPorDueno); // Desactivar mascotas por id de dueño
router.patch('/activar/dueno/:id_dueno', activarMascotasPorDueno); // Activar mascotas por id de dueño

export default router;
