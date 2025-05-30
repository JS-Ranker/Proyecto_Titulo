import Raza from '../models/razas.model.js';

const traerRazas = (req, res) => {
  Raza.traerTodas((err, razas) => {
    if (err) return res.status(500).json({ error: 'Error al obtener razas', detalle: err });
    res.json(razas);
  });
};

const traerRazasPorEspecie = (req, res) => {
  const especie_id = req.params.especie_id;
  Raza.traerPorEspecie(especie_id, (err, razas) => {
    if (err) return res.status(500).json({ error: 'Error al obtener razas', detalle: err });
    res.json(razas);
  });
};

const traerRazaPorId = (req, res) => {
  const id = req.params.id;
  Raza.traerPorId(id, (err, raza) => {
    if (err) return res.status(500).json({ error: 'Error al obtener la raza', detalle: err });
    if (!raza) return res.status(404).json({ error: 'Raza no encontrada' });
    res.json(raza);
  });
};

export { traerRazas, traerRazasPorEspecie, traerRazaPorId };