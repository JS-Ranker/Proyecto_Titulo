
import axios from 'axios';

import { API_BASE } from './api';
const API_BASE_URL = `${API_BASE}/api/duenos`; // Ajusta según tu configuración

interface LoginData {
  rut: string;
  password: string;
}

interface DuenoData {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  password: string;
}

interface UpdateDuenoData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  // Solo al cambiar la contraseña: el backend verifica la actual antes de guardar la nueva
  password_actual?: string;
  password_nueva?: string;
}

export const apiService = {
  // Login de dueño
  loginDueno: async (loginData: LoginData) => {
    const response = await axios.post(`${API_BASE_URL}/login`, loginData);
    return response;
  },

  // Crear nuevo dueño
  crearDueno: async (duenoData: DuenoData) => {
    const response = await axios.post(API_BASE_URL, duenoData);
    return response;
  },

  // Obtener todos los dueños
  obtenerDuenos: async () => {
    const response = await axios.get(API_BASE_URL);
    return response;
  },

  // Obtener dueño por RUT
  obtenerDuenoPorRut: async (rut: string) => {
    const response = await axios.get(`${API_BASE_URL}/${rut}`);
    return response;
  },

  // Actualizar dueño
  actualizarDueno: async (rut: string, updateData: UpdateDuenoData) => {
    const response = await axios.put(`${API_BASE_URL}/${rut}`, updateData);
    return response;
  },

  // Desactivar dueño
  desactivarDueno: async (rut: string) => {
    const response = await axios.put(`${API_BASE_URL}/desactivar/${rut}`);
    return response;
  },

  // Activar dueño
  activarDueno: async (rut: string) => {
    const response = await axios.put(`${API_BASE_URL}/activar/${rut}`);
    return response;
  }
};