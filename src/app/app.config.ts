import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page/home-page.component';
import { LoginComponent } from './core/auth/login/login.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { BuscarComponent } from './pages/buscar/buscar.component';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { ArticuloComponent } from './pages/articulo/articulo.component';
import { authInterceptor } from './core/services/auth.interceptor'; // Asegúrate de que esto esté importado correctamente
import { AuthGuard } from './core/services/auth.guard';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './core/auth/register/register.component';
import { HomeVendedorComponent } from './pages/home-vendedor/home-vendedor.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent}, //canActivate: [AuthGuard] }, // Ruta protegida },
  { path: 'home', component: HomePageComponent}, //canActivate: [AuthGuard] }, // Ruta protegida },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'perfil', component: PerfilComponent}, //canActivate: [AuthGuard] }, // Ruta protegida },
  { path: 'carrito', component: CarritoComponent}, //canActivate: [AuthGuard] }, // Ruta protegida },
  { path: 'buscar', component: BuscarComponent}, //canActivate: [AuthGuard] }, // Ruta protegida },
  { path: 'categoria/:id', component: CategoriaComponent}, //canActivate: [AuthGuard] }, // Ruta protegida },
  { path: 'articulo/:id', component: ArticuloComponent}, //canActivate: [AuthGuard] }, // Ruta protegida },
  { path: 'home-vendedor', component: HomeVendedorComponent } // Redirigir a la página de inicio si no se encuentra la ruta
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])), // Aquí se usa el interceptor como función
    provideRouter(routes),
    AuthGuard,
    FormsModule,
  ]
};
