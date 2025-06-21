import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class RazasService {
  private apiUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  getByEspecie(id_especie: number) {
    return this.http.get<any>(`${this.apiUrl}/razas/especie/${id_especie}`);
  }
}  