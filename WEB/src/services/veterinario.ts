import axios from "axios";
import { API_BASE } from './api';
const API_BASE_URL = `${API_BASE}/api/veterinarios`;

export interface Veterinario {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  especialidad_id: number;
  numero_licencia: string;
}

export interface VeterinarioPerfil {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  password?: string;
  especialidad_id: number;
  numero_licencia: string;
  fecha_registro: string;
  activo: boolean;
  nombre_especialidad?: string;
  descripcion_especialidad?: string;
}

export interface ActualizarPerfilData {
  email: string;
  telefono: string;
}

export interface ActualizarPasswordData {
  passwordActual: string;
  nuevaPassword: string;
}

export const veterinariosService = {
  obtenerPorEspecialidad: async (especialidad_id: number): Promise<Veterinario[]> => {
    const res = await axios.get(`${API_BASE_URL}/especialidad/${especialidad_id}`);
    return res.data;
  },

  // Obtener perfil completo del veterinario
  obtenerPerfilCompleto: async (id: number) => {
    const response = await axios.get(`${API_BASE_URL}/perfil/${id}`);
    return response;
  },

  // Actualizar perfil del veterinario
  actualizarPerfil: async (id: number, data: ActualizarPerfilData) => {
    const response = await axios.put(`${API_BASE_URL}/perfil/${id}`, data);
    return response;
  },

  // Actualizar contraseña del veterinario
  actualizarPassword: async (id: number, data: ActualizarPasswordData) => {
    const response = await axios.put(`${API_BASE_URL}/password/${id}`, data);
    return response;
  },
};