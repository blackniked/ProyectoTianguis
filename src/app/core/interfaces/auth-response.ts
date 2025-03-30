export interface AuthResponse {
    token: string;
    user?: any; // Si el backend también devuelve información del usuario
  }
  