import axios from "axios";

export const categoriasService = {
  obtenerTodas: async () => {
    const res = await axios.get("http://localhost:3000/api/categorias");
    return res.data;
  },
};