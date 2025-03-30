
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule]
})
export class LoginComponent {
  credentials = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.credentials).subscribe(response => {
      console.log('Inicio de sesión exitoso', response);
      localStorage.setItem('token', response.token); // Guardar el token
    }, error => {
      console.error('Error en el login', error);
    });
  }
}

