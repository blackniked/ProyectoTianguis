import { Component, inject, signal, WritableSignal } from '@angular/core';
import { HeaderService } from '../../core/services/header.service';

@Component({
  selector: 'app-registrar-productos',
  standalone: true,
  imports: [],
  templateUrl: './registrar-productos.component.html',
  styleUrl: './registrar-productos.component.css'
})
export class RegistrarProductosComponent {
//Aqui se inyectan los service
  headerService = inject(HeaderService);

  //Aqui se inician los services
  ngOnInit(): void {
    this.headerService.titulo.set("Registrar Productos");
}
}
