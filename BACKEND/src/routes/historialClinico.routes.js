import express from 'express';
import multer from 'multer';
import {
  obtenerHistorialPorMascota,
  obtenerMascotasPorVeterinario,
  crearRegistroHistorial,
  obtenerRegistroPorId,
  actualizarRegistroHistorial,
  eliminarRegistroHistorial,
  verificarAccesoVeterinario
} from '../controllers/historialClinico.controller.js';

const router = express.Router();

// Configuración de Multer para archivos adjuntos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/historial/');
  },
  filename: function (req, file, cb) {
    // Nombre único: fecha + nombre original
    const uniqueSuffix = Date.now() + '-' + file.originalname.replace(/\s/g, '');
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Permitir imágenes y PDFs
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen (JPEG, JPG, PNG) y documentos (PDF, DOC, DOCX)'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  }
});

// Rutas para historial clínico

// Obtener historial completo de una mascota (para dueños y veterinarios)
router.get('/mascota/:mascota_id', obtenerHistorialPorMascota);

// Obtener mascotas atendidas por un veterinario específico
router.get('/veterinario/:veterinario_id/mascotas', obtenerMascotasPorVeterinario);

// Crear nuevo registro en el historial (solo veterinarios)
router.post('/', upload.single('archivo'), crearRegistroHistorial);

// Obtener un registro específico por ID
router.get('/:id', obtenerRegistroPorId);

// Actualizar registro existente (solo veterinarios)
router.put('/:id', upload.single('archivo'), actualizarRegistroHistorial);

// Eliminar registro (solo veterinarios)
router.delete('/:id', eliminarRegistroHistorial);

// Verificar si un veterinario tiene acceso al historial de una mascota
router.get('/acceso/:veterinario_id/:mascota_id', verificarAccesoVeterinario);

export default router;
