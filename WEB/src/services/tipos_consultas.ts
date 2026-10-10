import axios from "axios";
import { API_BASE } from './api';
const API_BASE_URL = `${API_BASE}/api/tipos-consulta`;

export interface TipoConsulta {
  id: number;
  nombre: string;
  descripcion: string;
  duracion_minutos: number;
  precio: number;
}

export const tiposConsultaService = {
  obtenerTodos: async (): Promise<TipoConsulta[]> => {
    const res = await axios.get(API_BASE_URL);
    return res.data;
  },
}; 