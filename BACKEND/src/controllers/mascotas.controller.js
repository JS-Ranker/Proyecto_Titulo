import Mascota from '../models/mascotas.model.js';

const traerMascotas = (req, res) => {
  Mascota.traer((err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener las mascotas', detalle: err });
    }
    res.json(data);
  });
};

const crearMascota = (req, res) => {
  const datos = req.body;
  // Si hay archivo, guarda la ruta relativa
  if (req.file) {
    datos.url_imagen_mascota = req.file.path.replace(/\\/g, '/'); // Para Windows/Linux
  }

  if (!datos.id_dueno) {
    return res.status(400).json({ error: 'El dueño es obligatorio' });
  }

  if (!datos.nombre_mascota) {
    return res.status(400).json({ error: 'El nombre de la mascota es obligatorio' });
  }

  Mascota.crear(datos, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al crear mascota', detalle: err });
    }
    res.status(201).json({ mensaje: 'Mascota creada correctamente', id_mascota: result.insertId });
  });
};

const actualizarMascota = (req, res) => {
  const id = req.params.id;
  const datos = req.body;

  Mascota.buscarPorId(id, (err, mascota) => {
    if (err) {
      return res.status(500).json({ error: 'Error al buscar mascota', detalle: err });
    }
    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    Mascota.update(id, datos, (err2) => {
      if (err2) {
        return res.status(500).json({ error: 'Error al actualizar mascota', detalle: err2 });
      }
      res.json({ mensaje: 'Mascota actualizada correctamente' });
    });
  });
};

const desactivarMascota = (req, res) => {
  const id = req.params.id;

  Mascota.desactivar(id, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error al desactivar mascota', detalle: err });
    }
    res.json({ mensaje: 'Mascota desactivada correctamente' });
  });
};

const activarMascota = (req, res) => {
  const id = req.params.id;
  Mascota.activarPorId(id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al activar la mascota', detalle: err });
    res.json({ mensaje: 'Mascota activada correctamente' });
  });
};

const buscarMascotaPorId = (req, res) => {
  const id = req.params.id;

  Mascota.buscarPorId(id, (err, mascota) => {
    if (err) {
      return res.status(500).json({ error: 'Error al buscar mascota', detalle: err });
    }
    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }
    res.json(mascota);
  });
};

const buscarMascotasPorDueno = (req, res) => {
  const id_dueno = req.params.id_dueno;

  Mascota.buscarPorDueno(id_dueno, (err, mascotas) => {
    if (err) {
      return res.status(500).json({ error: 'Error al buscar las mascotas del dueño', detalle: err });
    }
    res.json(mascotas);
  });
};

const desactivarMascotasPorDueno = (req, res) => {
  const id_dueno = req.params.id_dueno;
  Mascota.desactivarPorDueno(id_dueno, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al desactivar las mascotas del dueño', detalle: err });
    }
    res.json({ mensaje: 'Mascotas desactivadas correctamente' });
  });
};

const activarMascotasPorDueno = (req, res) => {
  const id_dueno = req.params.id_dueno;
  Mascota.activarPorDueno(id_dueno, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al activar las mascotas del dueño', detalle: err });
    }
    res.json({ mensaje: 'Mascotas activadas correctamente' });
  });
};

const obtenerDatosCompletos = (req, res) => {
  const id = req.params.id;

  Mascota.obtenerDatosCompletos(id, (err, mascota) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener datos completos de la mascota', detalle: err });
    }
    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }
    res.json({ data: mascota, message: 'Datos completos obtenidos exitosamente' });
  });
};

export {
  traerMascotas,
  crearMascota,
  actualizarMascota,
  desactivarMascota,
  activarMascota,
  buscarMascotaPorId,
  buscarMascotasPorDueno,
  desactivarMascotasPorDueno,
  activarMascotasPorDueno,
  obtenerDatosCompletos,
};
