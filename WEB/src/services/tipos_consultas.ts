import axios from "axios";
const API_BASE_URL = "http://localhost:3000/api/tipos-consulta";

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