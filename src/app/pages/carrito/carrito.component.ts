import { Component, inject } from '@angular/core';
import { HeaderService } from '../../core/services/header.service';
import { CarritoService } from '../../core/services/carrito.service';
import { CommonModule } from '@angular/common';
import { ContadorCantidadComponent } from "../../core/components/contador-cantidad/contador-cantidad.component";

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, ContadorCantidadComponent],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  headerService = inject(HeaderService);
  carritoService = inject(CarritoService);

  ngOnInit(): void {
    this.headerService.titulo.set("Carrito");
  }

  eliminarProducto(idProducto:number){
    this.carritoService.eliminarProducto(idProducto);
  }
}
