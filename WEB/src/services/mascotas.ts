import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api/mascotas';

interface MascotaData {
    id_mascota?: number;
    nombre_mascota: string;
    id_especie?: number | null;
    id_raza?: number | null;
    fecha_nac_mascota?: string | null;
    peso_kg?: number | null;
    sexo_mascota?: string;
    esta_esterilizado?: boolean | number;
    color_mascota?: string | null;
    codigo_microchip?: string | null;
    url_imagen_mascota?: string | null;
    id_dueno: string;
    fecha_registro_mascota?: string;
    estado_activo?: boolean | number;
    dueno_nombre?: string;
    dueno_apellido?: string;
}

interface CreateMascotaData {
    nombre_mascota: string;
    id_especie?: number | null;
    id_raza?: number | null;
    fecha_nac_mascota?: string | null;
    peso_kg?: number | null;
    sexo_mascota?: string;
    esta_esterilizado?: boolean | number;
    color_mascota?: string | null;
    codigo_microchip?: string | null;
    url_imagen_mascota?: string | null;
    id_dueno: string;
}

interface UpdateMascotaData {
    nombre_mascota?: string;
    id_especie?: number | null;
    id_raza?: number | null;
    fecha_nac_mascota?: string | null;
    peso_kg?: number | null;
    sexo_mascota?: string;
    esta_esterilizado?: boolean | number;
    color_mascota?: string | null;
    codigo_microchip?: string | null;
    url_imagen_mascota?: string | null;
}

export const mascotasService = {
  // Obtener todas las mascotas activas
    obtenerMascotas: async () => {
    const response = await axios.get(API_BASE_URL);
    return response;
    },

  // Crear nueva mascota
    crearMascota: async (mascotaData: CreateMascotaData) => {
    const response = await axios.post(API_BASE_URL, mascotaData);
    return response;
    },

  // Obtener mascota por ID
    obtenerMascotaPorId: async (id: number) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response;
    },

  // Actualizar mascota
    actualizarMascota: async (id: number, updateData: UpdateMascotaData) => {
    const response = await axios.put(`${API_BASE_URL}/${id}`, updateData);
    return response;
    },

  // Desactivar mascota
    desactivarMascota: async (id: number) => {
    const response = await axios.patch(`${API_BASE_URL}/desactivar/${id}`);
    return response;
    },

  // Activar mascota
    activarMascota: async (id: number) => {
    const response = await axios.patch(`${API_BASE_URL}/activar/${id}`);
    return response;
    },

  // Obtener mascotas por dueño
    obtenerMascotasPorDueno: async (id_dueno: string) => {
    const response = await axios.get(`${API_BASE_URL}/dueno/${id_dueno}`);
    return response;
    }
};

export type { MascotaData, CreateMascotaData, UpdateMascotaData };