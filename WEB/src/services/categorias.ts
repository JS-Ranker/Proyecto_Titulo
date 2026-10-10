import axios from "axios";

import { API_BASE } from './api';
export const categoriasService = {
  obtenerTodas: async () => {
    const res = await axios.get(`${API_BASE}/api/categorias`);
    return res.data;
  },
};