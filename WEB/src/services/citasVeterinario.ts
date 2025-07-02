import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/citas';

interface CitaVeterinario {
  id: number;
  mascota_id: number;
  veterinario_id: number;
  tipo_consulta_id?: number;
  fecha_hora: string;
  duracion_minutos: number;
  motivo?: string;
  estado: 'pendiente' | 'completada' | 'cancelada';
  notas_previas?: string;
  notas_posteriores?: string;
  notas_atencion?: string;
  fecha_creacion?: string;
  
  // Información completa de la mascota
  nombre_mascota: string;
  id_especie: number;
  id_raza: number;
  fecha_nac_mascota?: string;
  peso_kg?: number;
  sexo_mascota?: string;
  esta_esterilizado?: boolean;
  color_mascota?: string;
  codigo_microchip?: string;
  url_imagen_mascota?: string;
  
  // Información del dueño
  dueno_rut: string;
  dueno_nombre: string;
  dueno_apellido: string;
  dueno_telefono?: string;
  dueno_email: string;
  
  // Nombres de relaciones
  tipo_consulta?: string;
  especie_nombre: string;
  raza_nombre: string;
  
  // Campos calculados (compatibilidad)
  edad?: number;
  peso?: number;
  raza?: string;
  especie?: string;
}

interface EstadisticasVeterinario {
  total_citas: number;
  citas_pendientes: number;
  citas_completadas: number;
  citas_canceladas: number;
  citas_hoy: number;
}

interface ActualizarCitaData {
  estado: 'pendiente' | 'completada' | 'cancelada';
  notas_atencion?: string;
}

export const citasVeterinarioService = {
  // Obtener todas las citas de un veterinario
  obtenerCitasPorVeterinario: async (veterinario_id: number) => {
    const response = await axios.get(`${API_BASE_URL}/veterinario/${veterinario_id}`);
    return response;
  },

  // Obtener citas del día para un veterinario
  obtenerCitasDelDia: async (veterinario_id: number, fecha?: string) => {
    const params = fecha ? `?fecha=${fecha}` : '';
    const response = await axios.get(`${API_BASE_URL}/veterinario/${veterinario_id}/dia${params}`);
    return response;
  },

  // Obtener estadísticas del veterinario
  obtenerEstadisticas: async (veterinario_id: number) => {
    const response = await axios.get(`${API_BASE_URL}/veterinario/${veterinario_id}/estadisticas`);
    return response;
  },

  // Obtener detalle completo de una cita
  obtenerDetalleCita: async (cita_id: number) => {
    const response = await axios.get(`${API_BASE_URL}/detalle/${cita_id}`);
    return response;
  },

  // Actualizar cita con notas
  actualizarCita: async (cita_id: number, datos: ActualizarCitaData) => {
    const response = await axios.patch(`${API_BASE_URL}/${cita_id}/actualizar`, datos);
    return response;
  },

  // Completar cita
  completarCita: async (cita_id: number, notas_atencion?: string) => {
    const response = await axios.patch(`${API_BASE_URL}/${cita_id}/completar`, { notas_atencion });
    return response;
  },

  // Cancelar cita
  cancelarCita: async (cita_id: number) => {
    const response = await axios.patch(`${API_BASE_URL}/${cita_id}/cancelar`);
    return response;
  }
};

export type { CitaVeterinario, EstadisticasVeterinario, ActualizarCitaData };
