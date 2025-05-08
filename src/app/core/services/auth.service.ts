import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://18.116.15.141'; // URL de tu backend

  constructor(private http: HttpClient) {}

  // Registro de usuario
  register(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/registro/`, userData).pipe(
      tap(response => {
        localStorage.setItem('token', response.token); // Guardar el token después de registrarse
      })
    );
  }

  // Inicio de sesión
  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/token/`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token); // Guardar el token
      })
    );
  }
}
