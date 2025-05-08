import { Component, inject } from '@angular/core';
import { HeaderService } from '../../core/services/header.service';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent {
articuloMasVendido: { nombre: string; cantidadVendida: number } = {
  nombre: "Articulo 1",
  cantidadVendida: 100
};
//Aqui se inyectan los service
  headerService = inject(HeaderService);

  //Aqui se inician los services
  ngOnInit(): void {
    this.headerService.titulo.set("Ver estadisticas");
}

}
