import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page/home-page.component';
import { LoginComponent } from './pages/Login/login/login.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { BuscarComponent } from './pages/buscar/buscar.component';
import { CategoriaComponent } from './pages/categoria/categoria.component';

//import { routes } from './app.routes';


/*export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
}; */

export const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'home', component: HomePageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'perfil', component: PerfilComponent},
  {path: 'carrito', component: CarritoComponent},
  {path: 'buscar', component: BuscarComponent},
  {path: 'categoria/:id', component: CategoriaComponent},
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};


