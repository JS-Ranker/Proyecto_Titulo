import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';

export interface Pet {
  id_mascota?: number;
  nombre_mascota: string;
  id_especie?: number | null;
  nombre_especie?: string;
  id_raza?: number | null;
  nombre_raza?: string;
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
  rut?: string;
  dueno_nombre?: string;
  dueno_apellido?: string;
  dueno_email?: string;
  dueno_telefono?: string;
}

export interface CreateMascotaData {
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

export interface UpdateMascotaData {
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

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MascotasService {
  private apiUrl = `${API_BASE_URL}/mascotas`;

  constructor(private http: HttpClient) {}

  // Obtener todas las mascotas activas
  obtenerMascotas(): Observable<ApiResponse<Pet[]>> {
    return this.http.get<ApiResponse<Pet[]>>(this.apiUrl);
  }

  // Crear nueva mascota
  crearMascota(mascotaData: CreateMascotaData): Observable<ApiResponse<Pet>> {
    return this.http.post<ApiResponse<Pet>>(this.apiUrl, mascotaData);
  }

  // Obtener mascota por ID
  obtenerMascotaPorId(id: number): Observable<ApiResponse<Pet>> {
    return this.http.get<ApiResponse<Pet>>(`${this.apiUrl}/${id}`);
  }

  // Obtener datos completos de mascota con información del dueño
  obtenerDatosCompletos(id: number): Observable<ApiResponse<Pet>> {
    return this.http.get<ApiResponse<Pet>>(`${this.apiUrl}/completos/${id}`);
  }

  // Actualizar mascota
  actualizarMascota(id: number, updateData: UpdateMascotaData): Observable<ApiResponse<Pet>> {
    return this.http.put<ApiResponse<Pet>>(`${this.apiUrl}/${id}`, updateData);
  }

  // Desactivar mascota
  desactivarMascota(id: number): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/desactivar/${id}`, {});
  }

  // Activar mascota
  activarMascota(id: number): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/activar/${id}`, {});
  }

  // Obtener mascotas por dueño - Este es el método principal que necesitamos
  obtenerMascotasPorDueno(id_dueno: string): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.apiUrl}/dueno/${id_dueno}`);
  }
}
