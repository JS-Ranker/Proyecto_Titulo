import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {
    // Verificar si hay una sesión guardada al inicializar
    this.checkStoredSession();
  }

  private checkStoredSession() {
    // Aquí puedes verificar localStorage, sessionStorage, o cualquier método de persistencia
    const token = localStorage.getItem('authToken');
    const isLoggedIn = !!token;
    this.isLoggedInSubject.next(isLoggedIn);
  }

  login(token: string) {
    localStorage.setItem('authToken', token);
    this.isLoggedInSubject.next(true);
  }

  logout() {
    localStorage.removeItem('authToken');
    this.isLoggedInSubject.next(false);
  }

  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}