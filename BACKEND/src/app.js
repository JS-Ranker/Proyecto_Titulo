import express from 'express';
import cors from 'cors';
import multer from 'multer';

import { env } from './config/env.js';
import { PUBLIC_DIR } from './config/uploads.js';
import duenosRoutes from './routes/duenos.routes.js';
import mascotasRoutes from './routes/mascotas.routes.js';
import razasRoutes from './routes/razas.routes.js';
import especiesRoutes from './routes/especies.routes.js';
import citasRoutes from './routes/citas.routes.js';
import tiposConsultaRoutes from './routes/tipos_consultas.routes.js';
import veterinarioRoutes from './routes/veterinario.routes.js';
import productosRoutes from './routes/productos.routes.js';
import categoriasRoutes from './routes/categorias.routes.js';
import adopcionesRoutes from './routes/adopciones.routes.js';
import historialClinicoRoutes from './routes/historialClinico.routes.js';

const app = express();

app.disable('x-powered-by');
app.use(cors({ origin: env.corsOrigins }));
app.use(express.json({ limit: '100kb' }));
// En local Express sirve public/ (imágenes de ejemplo y subidas); en Vercel lo hace el CDN
app.use(express.static(PUBLIC_DIR));

app.use('/api/duenos', duenosRoutes);
app.use('/api/mascotas', mascotasRoutes);
app.use('/api/razas', razasRoutes);
app.use('/api/especies', especiesRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/tipos-consulta', tiposConsultaRoutes);
app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/adopciones', adopcionesRoutes);
app.use('/api/historial-clinico', historialClinicoRoutes);

app.get('/', (req, res) => {
  res.send('API de Clínica Veterinaria funcionando!');
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Errores no capturados (archivos rechazados, JSON mal formado, etc.): nunca se expone el detalle interno.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const mensaje = err.code === 'LIMIT_FILE_SIZE' ? 'El archivo supera el tamaño máximo' : 'Archivo no válido';
    return res.status(400).json({ error: mensaje });
  }
  if (err.status && err.status < 500) {
    return res.status(err.status).json({ error: err.expose ? err.message : 'Solicitud no válida' });
  }
  console.error('Error no controlado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

export default app;
