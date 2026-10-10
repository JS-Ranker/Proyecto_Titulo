import Adopcion from '../models/adopciones.model.js';
import { errorServidor } from '../utils/errores.js';

export const traerAdopciones = (req, res) => {
  Adopcion.traer((err, data) => {
    if (err) return errorServidor(res, 'Error al obtener adopciones', err);
    res.json(data);
  });
};

export const buscarAdopcionPorId = (req, res) => {
  const id = req.params.id;
  Adopcion.buscarPorId(id, (err, adopcion) => {
    if (err) return errorServidor(res, 'Error al buscar adopción', err);
    if (!adopcion) return res.status(404).json({ error: 'Adopción no encontrada' });
    res.json(adopcion);
  });
};

export const crearAdopcion = (req, res) => {
  const datos = req.body;
  if (!datos.titulo || !datos.descripcion || !datos.contacto_nombre || !datos.contacto_email || !datos.nombre_mascota || !datos.especie) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  Adopcion.crear(datos, (err, result) => {
    if (err) return errorServidor(res, 'Error al crear adopción', err);
    res.status(201).json({ mensaje: 'Adopción creada correctamente', id: result.insertId });
  });
};

export const actualizarAdopcion = (req, res) => {
  const id = req.params.id;
  const datos = req.body;
  Adopcion.actualizar(id, datos, (err, result) => {
    if (err) return errorServidor(res, 'Error al actualizar adopción', err);
    res.json({ mensaje: 'Adopción actualizada correctamente' });
  });
};

export const eliminarAdopcion = (req, res) => {
  const id = req.params.id;
  Adopcion.eliminar(id, (err, result) => {
    if (err) return errorServidor(res, 'Error al eliminar adopción', err);
    res.json({ mensaje: 'Adopción eliminada correctamente' });
  });
};
