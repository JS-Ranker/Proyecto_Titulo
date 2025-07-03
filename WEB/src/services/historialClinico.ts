import axios from 'axios';

const BASE_URL = `http://localhost:3000/api/historial-clinico`;

export interface RegistroHistorial {
  id?: number;
  mascota_id: number;
  fecha: string;
  tipo: 'consulta' | 'vacuna' | 'cirugía' | 'tratamiento' | 'examen' | 'otro';
  descripcion: string;
  veterinario_id: number;
  archivos_adjuntos?: string;
  veterinario_nombre?: string;
  nombre_mascota?: string;
}

export interface MascotaAtendida {
  id_mascota: number;
  nombre_mascota: string;
  url_imagen_mascota?: string;
  dueno_nombre: string;
  dueno_apellido: string;
  total_consultas: number;
  ultima_consulta: string;
}

export const historialClinicoService = {
  // Obtener historial de una mascota específica
  obtenerHistorialPorMascota: (mascota_id: number) => {
    return axios.get(`${BASE_URL}/mascota/${mascota_id}`);
  },

  // Obtener mascotas atendidas por un veterinario
  obtenerMascotasPorVeterinario: (veterinario_id: number) => {
    return axios.get(`${BASE_URL}/veterinario/${veterinario_id}/mascotas`);
  },

  // Crear nuevo registro en el historial
  crearRegistroHistorial: (formData: FormData) => {
    return axios.post(BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Obtener un registro específico
  obtenerRegistroPorId: (id: number) => {
    return axios.get(`${BASE_URL}/${id}`);
  },

  // Actualizar registro existente
  actualizarRegistroHistorial: (id: number, formData: FormData) => {
    return axios.put(`${BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Eliminar registro
  eliminarRegistroHistorial: (id: number) => {
    return axios.delete(`${BASE_URL}/${id}`);
  },

  // Verificar acceso del veterinario
  verificarAccesoVeterinario: (veterinario_id: number, mascota_id: number) => {
    return axios.get(`${BASE_URL}/acceso/${veterinario_id}/${mascota_id}`);
  },
};
