import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class VeterinariosService {
  private apiUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  obtenerPorEspecialidad(especialidadId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/veterinarios/especialidad/${especialidadId}`);
  }
} 