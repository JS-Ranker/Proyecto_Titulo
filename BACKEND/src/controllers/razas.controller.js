import Raza from '../models/razas.model.js';
import { errorServidor } from '../utils/errores.js';

const traerRazas = (req, res) => {
  Raza.traerTodas((err, razas) => {
    if (err) return errorServidor(res, 'Error al obtener razas', err);
    res.json(razas);
  });
};

const traerRazasPorEspecie = (req, res) => {
  const especie_id = req.params.especie_id;
  Raza.traerPorEspecie(especie_id, (err, razas) => {
    if (err) return errorServidor(res, 'Error al obtener razas', err);
    res.json(razas);
  });
};

const traerRazaPorId = (req, res) => {
  const id = req.params.id;
  Raza.traerPorId(id, (err, raza) => {
    if (err) return errorServidor(res, 'Error al obtener la raza', err);
    if (!raza) return res.status(404).json({ error: 'Raza no encontrada' });
    res.json(raza);
  });
};

export { traerRazas, traerRazasPorEspecie, traerRazaPorId };