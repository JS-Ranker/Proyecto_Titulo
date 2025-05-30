import axios from "axios";
const API_BASE_URL = "http://localhost:3000/api/especies";

export const especiesService = {
  getAll: () => axios.get(API_BASE_URL),
};