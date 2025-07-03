// Archivo de prueba para verificar que el servidor funciona
import express from 'express';

const router = express.Router();

// Ruta de prueba simple
router.get('/test', (req, res) => {
  res.json({ message: 'Historial clínico funcionando correctamente' });
});

export default router;
