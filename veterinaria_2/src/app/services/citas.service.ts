import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';

export interface Cita {
  id?: number;
  mascota_id: number;
  veterinario_id?: number | null;
  tipo_consulta_id?: number | null;
  fecha_hora: string;
  duracion_minutos?: number;
  motivo?: string | null;
  estado?: 'pendiente' | 'confirmada' | 'cancelada' | 'completada' | 'no_asistio';
  notas_previas?: string | null;
  notas_posteriores?: string | null;
  fecha_creacion?: string;
  
  // Campos adicionales del JOIN
  nombre_mascota?: string;
  tipo_consulta?: string;
  veterinario?: string;
  dueno_nombre?: string;
  dueno_apellido?: string;
}

export interface CreateCitaData {
  mascota_id: number;
  veterinario_id?: number | null;
  tipo_consulta_id?: number | null;
  fecha_hora: string;
  duracion_minutos?: number;
  motivo?: string | null;
  notas_previas?: string | null;
}

export interface TipoConsulta {
  id: number;
  nombre: string;
  descripcion?: string;
  duracion_estimada?: number;
  precio?: number;
}

export interface Veterinario {
  id: number;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  especialidad?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private apiUrl = `${API_BASE_URL}/citas`;

  constructor(private http: HttpClient) {}

  // Crear nueva cita
  crearCita(citaData: CreateCitaData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl, citaData);
  }

  // Obtener citas por dueño (RUT)
  obtenerCitasPorDueno(rut: string): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/dueno/${rut}`);
  }

  // Cancelar cita
  cancelarCita(citaId: number): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(`${this.apiUrl}/cancelar/${citaId}`, {});
  }

  // Obtener tipos de consulta
  obtenerTiposConsulta(): Observable<TipoConsulta[]> {
    return this.http.get<TipoConsulta[]>(`${API_BASE_URL}/tipos-consulta`);
  }

  // Obtener veterinarios
  obtenerVeterinarios(): Observable<Veterinario[]> {
    return this.http.get<Veterinario[]>(`${API_BASE_URL}/veterinarios`);
  }

  // Verificar disponibilidad de horario
  verificarDisponibilidad(fecha_hora: string, veterinario_id?: number): Observable<{ disponible: boolean }> {
    const params = veterinario_id ? `?veterinario_id=${veterinario_id}` : '';
    return this.http.get<{ disponible: boolean }>(`${this.apiUrl}/disponibilidad/${fecha_hora}${params}`);
  }
}
