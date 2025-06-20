import Cita from '../models/citas.model.js';

export const crearCita = (req, res) => {
  const datos = req.body;
  Cita.crear(datos, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al crear la cita', detalle: err });
    }
    res.status(201).json({ mensaje: 'Cita creada correctamente', id: result.insertId });
  });
};