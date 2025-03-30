
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule]
})
export class RegisterComponent {
  credentials = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService) {}

  register() {
    this.authService.register(this.credentials).subscribe(response => {
      console.log('Inicio de sesión exitoso', response);
      localStorage.setItem('token', response.token); // Guardar el token
    }, error => {
      console.error('Error en el registro', error);
    });
  }
}