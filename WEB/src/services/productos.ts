import axios from "axios";

import { API_BASE } from './api';
export const productosService = {
  obtenerTodos: async () => {
    const response = await axios.get(`${API_BASE}/api/productos`);
    return response.data;
  },
};