import Veterinario from '../models/veterinario.model.js';

export const traerVeterinariosPorEspecialidad = (req, res) => {
  const { especialidad_id } = req.params;
  Veterinario.traerPorEspecialidad(especialidad_id, (err, vets) => {
    if (err) return res.status(500).json({ error: 'Error al obtener veterinarios', detalle: err });
    res.json(vets);
  });
};