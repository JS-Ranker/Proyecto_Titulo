import axios from "axios";

export const productosService = {
  obtenerTodos: async () => {
    const response = await axios.get("http://localhost:3000/api/productos");
    return response.data;
  },
};