import { Routes } from '@angular/router';
import { LoginComponent } from './tianguis-app/pages/Login/login/login.component';
import { HomePageComponent } from './tianguis-app/pages/home/home-page/home-page.component';

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
