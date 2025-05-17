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
// ...existing code...
login(credentials: any): Observable<AuthResponse> {
  return this.http.post<any>(`${this.apiUrl}/token/`, credentials).pipe(
    tap(response => {
      if (response.access) {
        localStorage.setItem('token', response.access); // Guardar solo el access token
      } else {
        console.error('No se recibió access token en la respuesta');
      }
      console.log('Respuesta del login:', response);
      console.log('Token guardado:', localStorage.getItem('token'));
    })
  );
}
// ...existing code...

}
