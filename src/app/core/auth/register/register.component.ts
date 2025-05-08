
import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { HeaderService } from '../../services/header.service';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, RouterLink]
})
export class RegisterComponent {
  usuario = {
    nombre: '',
    apellido: '',
    correo: '',
    password: '',
    telefono: '',
    direccion: '',
    fecha_nacimiento: Date,
    es_vendedor: false,
  };

  constructor(private authService: AuthService) {}
//Aqui se inyectan los service
  headerService = inject(HeaderService);

  //Aqui se inician los services
  ngOnInit(): void {
    this.headerService.titulo.set("Registrar Usuario");
}
  register() {
    this.authService.register(this.usuario).subscribe(response => {
      console.log('Inicio de sesión exitoso', response);
      localStorage.setItem('token', response.token); // Guardar el token
    }, error => {
      console.error('Error en el registro', error);
    });
  }
}