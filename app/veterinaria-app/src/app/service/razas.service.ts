import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RazasService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getByEspecie(id_especie: number) {
    return this.http.get<any>(`${this.apiUrl}/razas/especie/${id_especie}`);
  }
}