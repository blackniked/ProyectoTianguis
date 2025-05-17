import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderService } from '../../core/services/header.service';

interface Usuario {
  id: number;
  nombre: string;
}


@Component({
  selector: 'app-home-vendedor',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-vendedor.component.html',
  styleUrl: './home-vendedor.component.css'
})
export class HomeVendedorComponent {
//Aqui se inyectan los service
  headerService = inject(HeaderService);
usuario: Usuario = {
  id: 2,
  nombre: 'Alberto Lopez',
}

  //Aqui se inician los services
  ngOnInit(): void {
    this.headerService.titulo.set("Vendedor");
}
}
