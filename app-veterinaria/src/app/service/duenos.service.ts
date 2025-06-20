import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';

@Injectable({
  providedIn: 'root'
})
export class DuenosService {
  private apiUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/duenos`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/duenos/login`, data);
  }

  getDuenoPorRut(rut: string) {
    return this.http.get(`${this.apiUrl}/duenos/${rut}`);
  }

  actualizarDueno(rut: string, data: any) {
    return this.http.put(`${this.apiUrl}/duenos/${rut}`, data);
  }
} 