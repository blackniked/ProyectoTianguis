import { Component, inject } from '@angular/core';
import { HeaderService } from '../../core/services/header.service';
import { CarritoService } from '../../core/services/carrito.service';
import { CommonModule } from '@angular/common';
import { ContadorCantidadComponent } from "../../core/components/contador-cantidad/contador-cantidad.component";
import { Producto } from '../../core/interfaces/productos';
import { ProductosService } from '../../core/services/productos.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, ContadorCantidadComponent, RouterModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent {
  headerService = inject(HeaderService);
  carritoService = inject(CarritoService);
  productosService = inject(ProductosService);

productosCarrito: Producto[]=[];

subtotal = 0;
delivery = 100;
total = 0;


  ngOnInit(): void {
    this.headerService.titulo.set("Carrito");
    //Aqui obtenemos los datos para los productos del carrito
    this.carritoService.carrito.forEach(async itemCarrito =>{
      const res = await this.productosService.getById(itemCarrito.idProducto)
      if(res) this.productosCarrito.push(res);
      this.calcularInformacion();
    })
  }

  eliminarProducto(idProducto:number){
    this.carritoService.eliminarProducto(idProducto);
  }

  calcularInformacion() {
    this.subtotal = 0;
    for (let i = 0; i < this.carritoService.carrito.length;i++) {
      this.subtotal += this.productosCarrito[i].precio * this.carritoService.carrito[i].cantidad; 
      }
      this.total = this.subtotal + this.delivery;
  }

  cambiarCantidadProducto(id:number, cantidad:number){
    this.carritoService.cambiarCantidadProducto(id, cantidad)
    this.calcularInformacion();
  }
}
