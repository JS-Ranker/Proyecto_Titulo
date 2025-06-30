import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Adopcion {
  id?: number;
  titulo: string;
  descripcion: string;
  requisitos?: string;
  contacto_nombre: string;
  contacto_email: string;
  contacto_telefono?: string;
  ubicacion?: string;
  fecha_publicacion?: string;
  estado?: 'disponible' | 'en_proceso' | 'adoptado' | 'cancelado';
}

@Injectable({ providedIn: 'root' })
export class AdopcionesService {
  private apiUrl = 'http://localhost:3000/api/adopciones'; // Cambia el puerto si es necesario

  constructor(private http: HttpClient) {}

  getAll(): Observable<Adopcion[]> {
    return this.http.get<Adopcion[]>(this.apiUrl);
  }

  getById(id: number): Observable<Adopcion> {
    return this.http.get<Adopcion>(`${this.apiUrl}/${id}`);
  }

  create(adopcion: Adopcion): Observable<Adopcion> {
    return this.http.post<Adopcion>(this.apiUrl, adopcion);
  }

  update(id: number, adopcion: Adopcion): Observable<Adopcion> {
    return this.http.put<Adopcion>(`${this.apiUrl}/${id}`, adopcion);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
