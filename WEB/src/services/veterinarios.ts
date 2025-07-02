import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/veterinarios';

interface LoginVeterinarioData {
  email: string;
  password: string;
}

interface VeterinarioData {
  id?: number;
  nombre: string;
  email: string;
  telefono?: string;
  password?: string;
  especialidad_id?: number;
  numero_licencia?: string;
  fecha_registro?: string;
  activo?: boolean;
}

export const veterinarioService = {
  // Login de veterinario
  loginVeterinario: async (loginData: LoginVeterinarioData) => {
    const response = await axios.post(`${API_BASE_URL}/login`, loginData);
    return response;
  },

  // Obtener todos los veterinarios
  obtenerVeterinarios: async () => {
    const response = await axios.get(API_BASE_URL);
    return response;
  },

  // Obtener veterinario por ID
  obtenerVeterinarioPorId: async (id: number) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response;
  },

  // Crear nuevo veterinario
  crearVeterinario: async (veterinarioData: VeterinarioData) => {
    const response = await axios.post(API_BASE_URL, veterinarioData);
    return response;
  },

  // Actualizar veterinario
  actualizarVeterinario: async (id: number, veterinarioData: VeterinarioData) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, veterinarioData);
    return response;
  },

  // Eliminar veterinario
  eliminarVeterinario: async (id: number) => {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response;
  },

  // Obtener veterinarios por especialidad
  obtenerVeterinariosPorEspecialidad: async (especialidad_id: number) => {
    const response = await axios.get(`${API_BASE_URL}/especialidad/${especialidad_id}`);
    return response;
  }
};
