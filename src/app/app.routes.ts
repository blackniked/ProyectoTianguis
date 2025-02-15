import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page/home-page.component';
import { LoginComponent } from './pages/Login/login/login.component';

export const routes: Routes = [
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "",
        component: HomePageComponent
    }
];
