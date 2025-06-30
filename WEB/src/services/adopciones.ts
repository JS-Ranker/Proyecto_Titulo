import axios from 'axios';

export interface Adopcion {
  id: number;
  titulo: string;
  descripcion: string;
  requisitos?: string;
  contacto_nombre: string;
  contacto_email: string;
  contacto_telefono?: string;
  ubicacion?: string;
  fecha_publicacion?: string;
  estado?: 'disponible' | 'en_proceso' | 'adoptado' | 'cancelado';
  nombre_mascota: string;
  especie: 'perro' | 'gato' | 'otro';
  edad?: string;
  sexo?: 'macho' | 'hembra';
  imagen_url?: string;
}

const API_URL = 'http://localhost:3000/api/adopciones'; // Cambia el puerto si es necesario

export const getAdopciones = async (): Promise<Adopcion[]> => {
  const res = await axios.get<Adopcion[]>(API_URL);
  return res.data;
};

export const getAdopcionById = async (id: number): Promise<Adopcion> => {
  const res = await axios.get<Adopcion>(`${API_URL}/${id}`);
  return res.data;
};

export const createAdopcion = async (adopcion: Omit<Adopcion, 'id'>): Promise<Adopcion> => {
  const res = await axios.post<Adopcion>(API_URL, adopcion);
  return res.data;
};

export const updateAdopcion = async (id: number, adopcion: Partial<Adopcion>): Promise<Adopcion> => {
  const res = await axios.put<Adopcion>(`${API_URL}/${id}`, adopcion);
  return res.data;
};

export const deleteAdopcion = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
