import Especie from '../models/especies.model.js';
import { errorServidor } from '../utils/errores.js';

const traerEspecies = (req, res) => {
  Especie.traerTodas((err, especies) => {
    if (err) return errorServidor(res, 'Error al obtener especies', err);
    res.json(especies);
  });
};

export { traerEspecies };