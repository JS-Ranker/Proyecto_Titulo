import TipoConsulta from '../models/tipos_consulta.model.js';

export const traerTiposConsulta = (req, res) => {
  TipoConsulta.traerTodos((err, tipos) => {
    if (err) return res.status(500).json({ error: 'Error al obtener tipos de consulta', detalle: err });
    res.json(tipos);
  });
}; 