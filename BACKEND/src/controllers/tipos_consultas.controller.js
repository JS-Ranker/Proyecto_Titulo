import TipoConsulta from '../models/tipos_consulta.model.js';
import { errorServidor } from '../utils/errores.js';

export const traerTiposConsulta = (req, res) => {
  TipoConsulta.traerTodos((err, tipos) => {
    if (err) return errorServidor(res, 'Error al obtener tipos de consulta', err);
    res.json(tipos);
  });
}; 