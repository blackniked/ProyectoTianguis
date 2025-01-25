import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { HomePageComponent } from './tianguis-app/pages/home/home-page/home-page.component';
import { LoginComponent } from './tianguis-app/pages/Login/login/login.component';
import { PerfilComponent } from './tianguis-app/pages/perfil/perfil.component';
import { CarritoComponent } from './tianguis-app/pages/carrito/carrito.component';
import { TabsComponent } from './core/components/tabs/tabs.component';
import { BuscarComponent } from './tianguis-app/pages/buscar/buscar.component';
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
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};


