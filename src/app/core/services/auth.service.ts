import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://tu-api-url.com/api'; // URL de tu backend

  constructor(private http: HttpClient) {}

  // Registro de usuario
  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register/`, userData).pipe(
      tap(response => {
        localStorage.setItem('token', response.token); // Guardar el token después de registrarse
      })
    );
  }

  // Inicio de sesión
  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login/`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token); // Guardar el token
      })
    );
  }
}
