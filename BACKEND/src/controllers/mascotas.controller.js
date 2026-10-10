import Mascota from '../models/mascotas.model.js';
import { errorServidor } from '../utils/errores.js';
import { rutaPublica } from '../config/uploads.js';

const traerMascotas = (req, res) => {
  Mascota.traer((err, data) => {
    if (err) {
      return errorServidor(res, 'Error al obtener las mascotas', err);
    }
    res.json(data);
  });
};

const crearMascota = (req, res) => {
  const datos = {
    ...req.body,
    // El dueño siempre es el usuario autenticado y la imagen solo puede venir de una subida
    id_dueno: req.usuario.sub,
    url_imagen_mascota: req.file ? rutaPublica(req.file) : null,
  };

  if (!datos.nombre_mascota) {
    return res.status(400).json({ error: 'El nombre de la mascota es obligatorio' });
  }

  Mascota.crear(datos, (err, result) => {
    if (err) {
      return errorServidor(res, 'Error al crear mascota', err);
    }
    res.status(201).json({ mensaje: 'Mascota creada correctamente', id_mascota: result.insertId });
  });
};

const actualizarMascota = (req, res) => {
  const id = req.params.id;
  const datos = req.body;

  Mascota.buscarPorId(id, (err, mascota) => {
    if (err) {
      return errorServidor(res, 'Error al buscar mascota', err);
    }
    if (!mascota) {
      return res.status(404).json({ error: 'Mascota no encontrada' });
    }

    Mascota.update(id, datos, (err2) => {
      if (err2) {
        return errorServidor(res, 'Error al actualizar mascota', err2);
      }
      res.json({ mensaje: 'Mascota actualizada correctamente' });
    });
  });
};

const desactivarMascota = (req, res) => {
  const id = req.params.id;

  Mascota.desactivar(id, (err) => {
    if (err) {
      return errorServidor(res, 'Error al desactivar mascota', err);
    }
    res.json({ mensaje: 'Mascota desactivada correctamente' });
  });
};

const activarMascota = (req, res) => {
  const id = req.params.id;
  Mascota.activarPorId(id, (err, result) => {
    if (err) return errorServidor(res, 'Error al activar la mascota', err);
    res.json({ mensaje: 'Mascota activada correctamente' });
  });
};

const buscarMascotaPorId = (req, res) => {
  const id = req.params.id;

  Mascota.buscarPorId(id, (err, mascota) => {
    if (err) {
      return errorServidor(res, 'Error al buscar mascota', err);
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
      return errorServidor(res, 'Error al buscar las mascotas del dueño', err);
    }
    res.json(mascotas);
  });
};

const desactivarMascotasPorDueno = (req, res) => {
  const id_dueno = req.params.id_dueno;
  Mascota.desactivarPorDueno(id_dueno, (err, result) => {
    if (err) {
      return errorServidor(res, 'Error al desactivar las mascotas del dueño', err);
    }
    res.json({ mensaje: 'Mascotas desactivadas correctamente' });
  });
};

const activarMascotasPorDueno = (req, res) => {
  const id_dueno = req.params.id_dueno;
  Mascota.activarPorDueno(id_dueno, (err, result) => {
    if (err) {
      return errorServidor(res, 'Error al activar las mascotas del dueño', err);
    }
    res.json({ mensaje: 'Mascotas activadas correctamente' });
  });
};

const obtenerDatosCompletos = (req, res) => {
  const id = req.params.id;

  Mascota.obtenerDatosCompletos(id, (err, mascota) => {
    if (err) {
      return errorServidor(res, 'Error al obtener datos completos de la mascota', err);
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
