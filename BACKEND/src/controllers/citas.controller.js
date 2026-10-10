import Cita from '../models/citas.model.js';
import { errorServidor } from '../utils/errores.js';
import { ejecutar } from '../utils/promesa.js';
import Mascota from '../models/mascotas.model.js';

// Crear nueva cita
export const crearCita = async (req, res) => {
  const { mascota_id, fecha_hora } = req.body ?? {};
  if (!mascota_id || !fecha_hora) {
    return res.status(400).json({ error: 'La mascota y la fecha son obligatorias' });
  }

  // Solo se puede agendar para una mascota propia
  try {
    const mascota = await ejecutar(Mascota.buscarPorId, mascota_id);
    if (!mascota || mascota.id_dueno !== req.usuario.sub) {
      return res.status(403).json({ error: 'Solo puedes agendar citas para tus mascotas' });
    }
  } catch (err) {
    return errorServidor(res, 'Error al verificar la mascota', err);
  }

  // Una cita nueva siempre parte pendiente, sin importar lo que envíe el cliente
  const datos = { ...req.body, estado: 'pendiente' };
  Cita.crear(datos, (err, result) => {
    if (err) {
      return errorServidor(res, 'Error al crear la cita', err);
    }
    res.status(201).json({ mensaje: 'Cita creada correctamente', id: result.insertId });
  });
};

// Obtener citas por rut de dueño
export const obtenerCitasPorDueno = (req, res) => {
  const { rut } = req.params;
  // Buscar mascotas del dueño
  Mascota.buscarPorDueno(rut, (err, mascotas) => {
    if (err) return errorServidor(res, 'Error al buscar mascotas', err);
    if (!mascotas || mascotas.length === 0) return res.json([]);
    const ids = mascotas.map(m => m.id_mascota);
    // Buscar citas de esas mascotas
    Cita.obtenerPorMascotas(ids, (err2, citas) => {
      if (err2) return errorServidor(res, 'Error al buscar citas', err2);
      res.json(citas);
    });
  });
};

export const cancelarCita = (req, res) => {
  const { id } = req.params;
  Cita.actualizarEstado(id, 'cancelada', (err, result) => {
    if (err) {
      return errorServidor(res, 'Error al cancelar la cita', err);
    }
    res.json({ mensaje: 'Cita cancelada correctamente' });
  });
};

// Obtener citas por veterinario
export const obtenerCitasPorVeterinario = (req, res) => {
  const { veterinario_id } = req.params;
  
  console.log('Obteniendo citas para veterinario ID:', veterinario_id);
  
  if (!veterinario_id || veterinario_id === 'undefined') {
    return res.status(400).json({ error: 'ID de veterinario no válido' });
  }
  
  Cita.obtenerPorVeterinario(veterinario_id, (err, citas) => {
    if (err) {
      console.error('Error en base de datos:', err);
      return errorServidor(res, 'Error al obtener citas del veterinario', err);
    }
    
    console.log('Citas encontradas:', citas.length);
    res.json(citas);
  });
};

// Obtener citas del día para un veterinario
export const obtenerCitasDelDia = (req, res) => {
  const { veterinario_id } = req.params;
  const { fecha } = req.query;
  
  const fechaConsulta = fecha || new Date().toISOString().split('T')[0];
  
  Cita.obtenerCitasDelDia(veterinario_id, fechaConsulta, (err, citas) => {
    if (err) {
      return errorServidor(res, 'Error al obtener citas del día', err);
    }
    res.json(citas);
  });
};

// Obtener estadísticas del veterinario
export const obtenerEstadisticasVeterinario = (req, res) => {
  const { veterinario_id } = req.params;
  
  console.log('Obteniendo estadísticas para veterinario ID:', veterinario_id);
  
  if (!veterinario_id || veterinario_id === 'undefined') {
    return res.status(400).json({ error: 'ID de veterinario no válido' });
  }
  
  Cita.obtenerEstadisticasVeterinario(veterinario_id, (err, estadisticas) => {
    if (err) {
      console.error('Error en base de datos al obtener estadísticas:', err);
      return errorServidor(res, 'Error al obtener estadísticas', err);
    }
    
    console.log('Estadísticas obtenidas:', estadisticas[0]);
    res.json(estadisticas[0] || {});
  });
};

// Completar cita con notas posteriores
export const completarCita = (req, res) => {
  const { id } = req.params;
  const { notas_posteriores } = req.body;
  
  Cita.completarCita(id, notas_posteriores || '', (err, result) => {
    if (err) {
      return errorServidor(res, 'Error al completar la cita', err);
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    
    res.json({ mensaje: 'Cita marcada como completada' });
  });
};

// Cancelar cita con motivo
export const cancelarCitaConMotivo = (req, res) => {
  const { id } = req.params;
  const { motivo_cancelacion } = req.body;
  
  if (!motivo_cancelacion) {
    return res.status(400).json({ error: 'El motivo de cancelación es requerido' });
  }
  
  Cita.cancelarCita(id, motivo_cancelacion, (err, result) => {
    if (err) {
      return errorServidor(res, 'Error al cancelar la cita', err);
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    
    res.json({ mensaje: 'Cita cancelada correctamente' });
  });
};

// Actualizar estado de cita
export const actualizarEstadoCita = (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  
  if (!estado) {
    return res.status(400).json({ error: 'El estado es requerido' });
  }
  
  // Validar estados permitidos
  const estadosPermitidos = ['pendiente', 'confirmada', 'cancelada', 'completada', 'no_asistio'];
  if (!estadosPermitidos.includes(estado)) {
    return res.status(400).json({ error: 'Estado no válido' });
  }
  
  Cita.actualizarEstado(id, estado, (err, result) => {
    if (err) {
      return errorServidor(res, 'Error al actualizar estado de la cita', err);
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    
    res.json({ mensaje: 'Estado de cita actualizado correctamente' });
  });
};