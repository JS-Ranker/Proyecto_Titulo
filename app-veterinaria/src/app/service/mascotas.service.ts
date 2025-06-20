import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class MascotasService {
  private apiUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  obtenerMascotasPorDueno(rut: string) {
    return this.http.get(`${this.apiUrl}/mascotas/dueno/${rut}`);
  }

  crearMascota(formData: FormData) {
    return this.http.post(`${this.apiUrl}/mascotas`, formData);
  }
} 