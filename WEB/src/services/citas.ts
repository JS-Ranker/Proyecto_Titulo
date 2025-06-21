import axios from "axios";
const API_BASE_URL = "http://localhost:3000/api/citas";

export interface CitaData {
  mascota_id: number;
  veterinario_id?: number | null;
  tipo_consulta_id?: number | null;
  fecha_hora: string; // formato ISO: "2024-06-20T15:00:00"
  duracion_minutos?: number;
  motivo?: string;
  estado?: string;
  notas_previas?: string;
}

export const citasService = {
  crearCita: async (data: CitaData) => {
    const response = await axios.post(API_BASE_URL, data);
    return response.data;
  },
  obtenerCitasPorDueno: async (rut: string) => {
    const response = await axios.get(`http://localhost:3000/api/citas/dueno/${rut}`);
    return response.data;
  },
  cancelarCita: async (id: number) => {
    const response = await axios.patch(`${API_BASE_URL}/${id}/cancelar`);
    return response.data;
  },
};  