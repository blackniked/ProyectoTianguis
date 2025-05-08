
import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { HeaderService } from '../../services/header.service';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, RouterLink]
})
export class LoginComponent {
  credenciales = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService) {}
//Aqui se inyectan los service
  headerService = inject(HeaderService);

  //Aqui se inician los services
  ngOnInit(): void {
    this.headerService.titulo.set("Iniciar Sesión");
}
  login() {
    this.authService.login(this.credenciales).subscribe(response => {
      console.log('Inicio de sesión exitoso', response);
      localStorage.setItem('token', response.token); // Guardar el token
    }, error => {
      console.error('Error en el login', error);
    });
  }
}

