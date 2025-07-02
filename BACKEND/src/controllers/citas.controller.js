import Cita from '../models/citas.model.js';
import Mascota from '../models/mascotas.model.js';

// Crear nueva cita
export const crearCita = (req, res) => {
  const datos = req.body;
  Cita.crear(datos, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al crear la cita', detalle: err });
    }
    res.status(201).json({ mensaje: 'Cita creada correctamente', id: result.insertId });
  });
};

// Obtener citas por rut de dueño
export const obtenerCitasPorDueno = (req, res) => {
  const { rut } = req.params;
  // Buscar mascotas del dueño
  Mascota.buscarPorDueno(rut, (err, mascotas) => {
    if (err) return res.status(500).json({ error: 'Error al buscar mascotas', detalle: err });
    if (!mascotas || mascotas.length === 0) return res.json([]);
    const ids = mascotas.map(m => m.id_mascota);
    // Buscar citas de esas mascotas
    Cita.obtenerPorMascotas(ids, (err2, citas) => {
      if (err2) return res.status(500).json({ error: 'Error al buscar citas', detalle: err2 });
      res.json(citas);
    });
  });
};

export const cancelarCita = (req, res) => {
  const { id } = req.params;
  Cita.actualizarEstado(id, 'cancelada', (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error al cancelar la cita', detalle: err });
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
      return res.status(500).json({ error: 'Error al obtener citas del veterinario', detalle: err });
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
      return res.status(500).json({ error: 'Error al obtener citas del día', detalle: err });
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
      return res.status(500).json({ error: 'Error al obtener estadísticas', detalle: err });
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
      return res.status(500).json({ error: 'Error al completar la cita', detalle: err });
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
      return res.status(500).json({ error: 'Error al cancelar la cita', detalle: err });
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
      return res.status(500).json({ error: 'Error al actualizar estado de la cita', detalle: err });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    
    res.json({ mensaje: 'Estado de cita actualizado correctamente' });
  });
};