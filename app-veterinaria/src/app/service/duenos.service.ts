import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE_URL = 'http://localhost:3000/api/duenos'; // Cambia la URL si tu backend es diferente

@Injectable({
  providedIn: 'root'
})
export class DuenosService {
  private apiUrl = 'http://localhost:3000/api'; // Ajusta según tu backend

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(API_BASE_URL, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${API_BASE_URL}/login`, data);
  }

  getDuenoPorRut(rut: string) {
    return this.http.get(`${this.apiUrl}/duenos/${rut}`);
  }

  actualizarDueno(rut: string, data: any) {
    return this.http.put(`${this.apiUrl}/duenos/${rut}`, data);
  }
}