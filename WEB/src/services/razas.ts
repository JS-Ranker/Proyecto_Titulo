import axios from "axios";
const API_BASE_URL = "http://localhost:3000/api/razas";

export const razasService = {
  getAll: () => axios.get(API_BASE_URL),
  getByEspecie: (especie_id: number) => axios.get(`${API_BASE_URL}/especie/${especie_id}`),
  getById: (id: number) => axios.get(`${API_BASE_URL}/${id}`),
};