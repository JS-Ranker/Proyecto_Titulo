import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './api-config';

@Injectable({ providedIn: 'root' })
export class EspeciesService {
  private apiUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any>(`${this.apiUrl}/especies`);
  }
}