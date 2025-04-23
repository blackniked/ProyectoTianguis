import { provideRouter, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page/home-page.component';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { AuthGuard } from './core/services/auth.guard';

export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "register",
        component: RegisterComponent
    },
    {
        path: "home-vendedor",
        component: HomePageComponent, canActivate: [AuthGuard] // Ruta protegida
    },
    {
        path: "",
        component: HomePageComponent, canActivate: [AuthGuard]
    },
    { 
        path: '**', 
        redirectTo: 'login', 
        pathMatch: 'full' 
    } // Redirección a login si la ruta no existe
];

export const appRouting = provideRouter(routes);