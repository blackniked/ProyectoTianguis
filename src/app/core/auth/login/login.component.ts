
import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { HeaderService } from '../../services/header.service';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, RouterLink]
})
export class LoginComponent {
  credenciales = {
    correo: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}
//Aqui se inyectan los service
  headerService = inject(HeaderService);

  //Aqui se inician los services
  ngOnInit(): void {
    this.headerService.titulo.set("Iniciar Sesión");
  }

  login() {
    this.authService.login(this.credenciales).subscribe({
      next: response => {
        console.log('Inicio de sesión exitoso', response);
        if (response.access) {
        localStorage.setItem('token', response.access);} // Guardar el token
        this.router.navigate(['/home']);
        // Aquí puedes redirigir o mostrar mensaje de éxito
      },
      error: error => {
        console.error('Error en el login', error);
        // Aquí puedes mostrar un mensaje de error al usuario
      }
    });
  }
}

