import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import https from 'https';
import fs from 'fs';

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
import testRoutes from './routes/test.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

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
app.use('/api/test', testRoutes);


app.get('/', (req, res) => {
  res.send('API de Clínica Veterinaria funcionando!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor HTTP corriendo en http://192.168.1.17:${PORT}`);
});