import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RegistroProdsService {
  private apiUrl = 'https://ez-market.shop/productos';

  constructor(private http: HttpClient) {}

  registrarProducto(producto: any): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.post(`${this.apiUrl}/`, producto, { headers });
}
}