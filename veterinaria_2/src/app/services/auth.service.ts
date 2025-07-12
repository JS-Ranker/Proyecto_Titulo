import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DuenosService } from './duenos.service';

export interface User {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
}

export interface Veterinario {
  id: number;
  nombre: string;
  email: string;
  telefono?: string;
  especialidad_id?: number;
  numero_licencia?: string;
  fecha_registro?: string;
  activo?: number;
}

export interface LoginData {
  rut: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentStoredUser());
  private currentVeterinarioSubject = new BehaviorSubject<Veterinario | null>(null);
  private userTypeSubject = new BehaviorSubject<'dueno' | 'veterinario' | null>(null);

  public isLoggedIn$ = this.loggedIn.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();
  public currentVeterinario$ = this.currentVeterinarioSubject.asObservable();
  public userType$ = this.userTypeSubject.asObservable();

  constructor(
    private http: HttpClient,
    private duenosService: DuenosService
  ) {
    this.checkStoredSession();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private getCurrentStoredUser(): User | null {
    try {
      const userData = localStorage.getItem('currentUser');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  private checkStoredSession(): void {
    try {
      const userData = localStorage.getItem('currentUser');
      const userRut = localStorage.getItem('currentUserRut');
      
      if (userData && userRut) {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
        this.userTypeSubject.next('dueno');
        this.loggedIn.next(true);
      }
    } catch (error) {
      console.error('Error al verificar sesión guardada:', error);
      this.logout();
    }
  }

  login(loginData: LoginData): Observable<any> {
    return this.duenosService.login(loginData)
      .pipe(
        map(response => {
          // Guardar datos del usuario como en app-veterinaria
          localStorage.setItem('currentUser', JSON.stringify(response));
          localStorage.setItem('currentUserRut', loginData.rut);
          
          // Si hay token en la respuesta, guardarlo
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          
          // Actualizar estados
          this.currentUserSubject.next(response);
          this.userTypeSubject.next('dueno');
          this.loggedIn.next(true);
          
          return response;
        })
      );
  }

  loginVeterinario(veterinarioData: Veterinario): void {
    this.currentVeterinarioSubject.next(veterinarioData);
    this.currentUserSubject.next(null);
    this.userTypeSubject.next('veterinario');
    this.loggedIn.next(true);
    
    localStorage.setItem('happypet_veterinario', JSON.stringify(veterinarioData));
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserRut');
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.currentVeterinarioSubject.next(null);
    this.userTypeSubject.next(null);
    this.loggedIn.next(false);
    
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserRut');
    localStorage.removeItem('happypet_veterinario');
  }

  getCurrentUserRut(): string | null {
    const rut = localStorage.getItem('currentUserRut');
    if (rut) return rut;
    
    const user = this.currentUserSubject.value;
    return user ? user.rut : null;
  }

  getCurrentVeterinarioId(): number | null {
    const veterinario = this.currentVeterinarioSubject.value;
    return veterinario ? veterinario.id : null;
  }

  isVeterinario(): boolean {
    return this.userTypeSubject.value === 'veterinario';
  }

  isDueno(): boolean {
    return this.userTypeSubject.value === 'dueno';
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get currentVeterinarioValue(): Veterinario | null {
    return this.currentVeterinarioSubject.value;
  }

  get userTypeValue(): 'dueno' | 'veterinario' | null {
    return this.userTypeSubject.value;
  }

  updateCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}
