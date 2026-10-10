import HistorialClinico from '../models/historialClinico.model.js';
import { errorServidor } from '../utils/errores.js';
import { rutaPublica } from '../config/uploads.js';

// Obtener historial de una mascota específica
const obtenerHistorialPorMascota = (req, res) => {
  const mascota_id = req.params.mascota_id;
  
  HistorialClinico.obtenerPorMascota(mascota_id, (err, data) => {
    if (err) {
      return errorServidor(res, 'Error al obtener el historial clínico', err);
    }
    res.json(data);
  });
};

// Obtener mascotas atendidas por un veterinario
const obtenerMascotasPorVeterinario = (req, res) => {
  const veterinario_id = req.params.veterinario_id;
  
  HistorialClinico.obtenerPorVeterinario(veterinario_id, (err, data) => {
    if (err) {
      return errorServidor(res, 'Error al obtener las mascotas atendidas', err);
    }
    res.json(data);
  });
};

// Crear nuevo registro en el historial
const crearRegistroHistorial = (req, res) => {
  // El autor del registro es siempre el veterinario autenticado
  const datos = { ...req.body, veterinario_id: req.usuario.sub };

  // Validaciones básicas
  if (!datos.mascota_id || !datos.tipo || !datos.descripcion) {
    return res.status(400).json({
      error: 'Faltan campos obligatorios: mascota_id, tipo, descripcion'
    });
  }

  // Validar tipo de consulta
  const tiposValidos = ['consulta', 'vacuna', 'cirugía', 'tratamiento', 'examen', 'otro'];
  if (!tiposValidos.includes(datos.tipo)) {
    return res.status(400).json({ 
      error: 'Tipo de consulta no válido. Debe ser: ' + tiposValidos.join(', ') 
    });
  }

  // Agregar archivo si se subió
  if (req.file) {
    datos.archivos_adjuntos = rutaPublica(req.file);
  }

  HistorialClinico.crear(datos, (err, result) => {
    if (err) {
      return errorServidor(res, 'Error al crear el registro del historial', err);
    }
    res.status(201).json({ 
      mensaje: 'Registro creado correctamente', 
      id: result.insertId 
    });
  });
};

// Obtener un registro específico del historial
const obtenerRegistroPorId = (req, res) => {
  const id = req.params.id;
  
  HistorialClinico.obtenerPorId(id, (err, data) => {
    if (err) {
      return errorServidor(res, 'Error al obtener el registro', err);
    }
    if (!data || data.length === 0) {
      return res.status(404).json({ 
        error: 'Registro no encontrado' 
      });
    }
    res.json(data[0]);
  });
};

// Actualizar registro del historial
const actualizarRegistroHistorial = (req, res) => {
  const id = req.params.id;
  const datos = req.body;
  
  // Validaciones básicas
  if (!datos.tipo || !datos.descripcion) {
    return res.status(400).json({ 
      error: 'Faltan campos obligatorios: tipo, descripcion' 
    });
  }

  // Validar tipo de consulta
  const tiposValidos = ['consulta', 'vacuna', 'cirugía', 'tratamiento', 'examen', 'otro'];
  if (!tiposValidos.includes(datos.tipo)) {
    return res.status(400).json({ 
      error: 'Tipo de consulta no válido. Debe ser: ' + tiposValidos.join(', ') 
    });
  }

  // Agregar archivo si se subió
  if (req.file) {
    datos.archivos_adjuntos = rutaPublica(req.file);
  }

  HistorialClinico.actualizar(id, datos, (err, result) => {
    if (err) {
      return errorServidor(res, 'Error al actualizar el registro', err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        error: 'Registro no encontrado' 
      });
    }
    res.json({ 
      mensaje: 'Registro actualizado correctamente' 
    });
  });
};

// Eliminar registro del historial
const eliminarRegistroHistorial = (req, res) => {
  const id = req.params.id;
  
  HistorialClinico.eliminar(id, (err, result) => {
    if (err) {
      return errorServidor(res, 'Error al eliminar el registro', err);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        error: 'Registro no encontrado' 
      });
    }
    res.json({ 
      mensaje: 'Registro eliminado correctamente' 
    });
  });
};

// Verificar acceso del veterinario a una mascota
const verificarAccesoVeterinario = (req, res) => {
  const { veterinario_id, mascota_id } = req.params;
  
  HistorialClinico.verificarAccesoVeterinario(veterinario_id, mascota_id, (err, data) => {
    if (err) {
      return errorServidor(res, 'Error al verificar acceso', err);
    }
    const tieneAcceso = data[0].count > 0;
    res.json({ tieneAcceso });
  });
};

export {
  obtenerHistorialPorMascota,
  obtenerMascotasPorVeterinario,
  crearRegistroHistorial,
  obtenerRegistroPorId,
  actualizarRegistroHistorial,
  eliminarRegistroHistorial,
  verificarAccesoVeterinario
};
