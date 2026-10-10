import axios from "axios";
import { API_BASE } from './api';
const API_BASE_URL = `${API_BASE}/api/especies`;

export const especiesService = {
  getAll: () => axios.get(API_BASE_URL),
};