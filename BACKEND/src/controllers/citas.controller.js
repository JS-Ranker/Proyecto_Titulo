import Cita from '../models/citas.model.js';
import Mascota from '../models/mascotas.model.js';

// Crear nueva cita
export const crearCita = (req, res) => {
  const datos = req.body;
  Cita.crear(datos, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al crear la cita', detalle: err });
    }
    res.status(201).json({ mensaje: 'Cita creada correctamente', id: result.insertId });
  });
};

// Obtener citas por rut de dueño
export const obtenerCitasPorDueno = (req, res) => {
  const { rut } = req.params;
  // Buscar mascotas del dueño
  Mascota.buscarPorDueno(rut, (err, mascotas) => {
    if (err) return res.status(500).json({ error: 'Error al buscar mascotas', detalle: err });
    if (!mascotas || mascotas.length === 0) return res.json([]);
    const ids = mascotas.map(m => m.id_mascota);
    // Buscar citas de esas mascotas
    Cita.obtenerPorMascotas(ids, (err2, citas) => {
      if (err2) return res.status(500).json({ error: 'Error al buscar citas', detalle: err2 });
      res.json(citas);
    });
  });
};

export const cancelarCita = (req, res) => {
  const { id } = req.params;
  Cita.actualizarEstado(id, 'cancelada', (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al cancelar la cita', detalle: err });
    }
    res.json({ mensaje: 'Cita cancelada correctamente' });
  });
};