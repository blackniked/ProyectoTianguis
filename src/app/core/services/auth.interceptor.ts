import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpInterceptorFn } from '@angular/common/http'; // Asegúrate de que esto esté importado correctamente

// Definir el interceptor como función
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const token = localStorage.getItem('token');

  if (token) {
    // Clonamos la solicitud y agregamos el token al encabezado
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
    });
    return next(clonedReq); // Continuamos con la solicitud modificada
  }

  return next(req); // Si no hay token, enviamos la solicitud sin cambios
};


