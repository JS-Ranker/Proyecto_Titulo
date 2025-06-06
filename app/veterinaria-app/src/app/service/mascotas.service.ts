import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MascotasService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  obtenerMascotasPorDueno(rut: string) {
    return this.http.get(`${this.apiUrl}/mascotas/dueno/${rut}`);
  }

  crearMascota(formData: FormData) {
    return this.http.post('http://localhost:3000/api/mascotas', formData);
  }
}