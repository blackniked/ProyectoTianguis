export interface AuthResponse {
    token: string;
    access: string; // Si el backend devuelve un access token
    user?: any; // Si el backend también devuelve información del usuario
  }
  