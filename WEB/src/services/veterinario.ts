import axios from "axios";
const API_BASE_URL = "http://localhost:3000/api/veterinarios";

export interface Veterinario {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  especialidad_id: number;
  numero_licencia: string;
}

export const veterinariosService = {
  obtenerPorEspecialidad: async (especialidad_id: number): Promise<Veterinario[]> => {
    const res = await axios.get(`${API_BASE_URL}/especialidad/${especialidad_id}`);
    return res.data;
  },
};