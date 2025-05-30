import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import duenosRoutes from './routes/duenos.routes.js';
import mascotasRoutes from './routes/mascotas.routes.js';
import razasRoutes from './routes/razas.routes.js';
import especiesRoutes from './routes/especies.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/duenos', duenosRoutes);
app.use('/api/mascotas', mascotasRoutes);
app.use('/api/razas', razasRoutes);
app.use('/api/especies', especiesRoutes);

app.get('/', (req, res) => {
  res.send('API de Clínica Veterinaria funcionando!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
});