import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class CitasService {
  private apiUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  crearCita(cita: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/citas`, cita);
  }

  obtenerCitasPorDueno(rut: string) {
    return this.http.get<any[]>(`${this.apiUrl}/citas/dueno/${rut}`);
  }

  cancelarCita(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/citas/${id}/cancelar`, {});
  }
}