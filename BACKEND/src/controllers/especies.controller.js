import Especie from '../models/especies.model.js';

const traerEspecies = (req, res) => {
  Especie.traerTodas((err, especies) => {
    if (err) return res.status(500).json({ error: 'Error al obtener especies', detalle: err });
    res.json(especies);
  });
};

export { traerEspecies };