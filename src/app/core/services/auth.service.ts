import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://ez-market.shop'; // URL de tu backend

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
  return this.http.post<AuthResponse>(`${this.apiUrl}/token/`, credentials).pipe(   //Aqui cambie token por usuarios
    tap(response => {
      console.log('Respuesta del login:', response); // <-- Agrega esto
      localStorage.setItem('token', response.token); // Guardar el token
      console.log('Token guardado:', localStorage.getItem('token')); // <-- Y esto
    })
  );
}

}
