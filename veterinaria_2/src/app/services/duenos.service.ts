import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';

export interface DuenoData {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  password: string;
}

export interface UpdateDuenoData {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  password: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DuenosService {
  private apiUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  // Función auxiliar para limpiar el RUT
  private cleanRut(rut: string): string {
    if (!rut) return '';
    // Eliminar todos los puntos pero mantener el guión
    return rut.replace(/\./g, '');
  }

  login(data: any): Observable<any> {
    const cleanData = {
      ...data,
      rut: this.cleanRut(data.rut)
    };
    return this.http.post(`${this.apiUrl}/duenos/login`, cleanData);
  }

  crearDueno(duenoData: DuenoData): Observable<ApiResponse<DuenoData>> {
    const cleanData = {
      ...duenoData,
      rut: this.cleanRut(duenoData.rut)
    };
    return this.http.post<ApiResponse<DuenoData>>(`${this.apiUrl}/duenos`, cleanData);
  }

  obtenerDuenos(): Observable<ApiResponse<DuenoData[]>> {
    return this.http.get<ApiResponse<DuenoData[]>>(`${this.apiUrl}/duenos`);
  }

  obtenerDuenoPorRut(rut: string): Observable<any> {
    const cleanRut = this.cleanRut(rut);
    return this.http.get<any>(`${this.apiUrl}/duenos/${cleanRut}`);
  }

  actualizarDueno(rut: string, updateData: Partial<UpdateDuenoData>): Observable<ApiResponse<DuenoData>> {
    const cleanRutParam = this.cleanRut(rut);
    return this.http.put<ApiResponse<DuenoData>>(`${this.apiUrl}/duenos/${cleanRutParam}`, updateData);
  }

  eliminarDueno(rut: string): Observable<ApiResponse<any>> {
    const cleanRut = this.cleanRut(rut);
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/duenos/${cleanRut}`);
  }

  // Métodos específicos para actualizar campos individuales
  actualizarEmail(rut: string, email: string): Observable<ApiResponse<DuenoData>> {
    const cleanRut = this.cleanRut(rut);
    return this.http.put<ApiResponse<DuenoData>>(`${this.apiUrl}/duenos/${cleanRut}`, { email });
  }

  actualizarTelefono(rut: string, telefono: string): Observable<ApiResponse<DuenoData>> {
    const cleanRut = this.cleanRut(rut);
    return this.http.put<ApiResponse<DuenoData>>(`${this.apiUrl}/duenos/${cleanRut}`, { telefono });
  }

  actualizarPassword(rut: string, currentPassword: string, newPassword: string): Observable<ApiResponse<DuenoData>> {
    const cleanRut = this.cleanRut(rut);
    return this.http.put<ApiResponse<DuenoData>>(`${this.apiUrl}/duenos/${cleanRut}`, { 
      currentPassword, 
      password: newPassword 
    });
  }
}
