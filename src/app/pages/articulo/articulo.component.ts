import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HeaderService } from '../../core/services/header.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductosService } from '../../core/services/productos.service';
import { Producto } from '../../core/interfaces/productos';
import { CommonModule } from '@angular/common';
import { ContadorCantidadComponent } from "../../core/components/contador-cantidad/contador-cantidad.component";
import { CarritoService } from '../../core/services/carrito.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-articulo',
  standalone: true,
  imports: [CommonModule, ContadorCantidadComponent, FormsModule],
  templateUrl: './articulo.component.html',
  styleUrl: './articulo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticuloComponent { 
    headerService = inject(HeaderService);
    productosService = inject(ProductosService);
    carritoService = inject(CarritoService);
  
  producto?: Producto;
  cantidad = signal(1);
  notas = "";

    ngOnInit(): void {
      this.headerService.titulo.set("Articulo");
    }

    constructor(private ac:ActivatedRoute, private router: Router){
      ac.params.subscribe(param => {
       // console.log(param)
        if(param['id']){
          this.productosService.getById(param['id']).then (producto => {
            this.producto = producto;
            this.headerService.titulo.set(producto!.nombre)
          })
        }
      })
    }

    agregarAlCarrito(){
      if(!this.producto) return;
      this.carritoService.agregarProducto(this.producto?.id,this.cantidad(), this.notas);
      this.router.navigate(["/carrito"]);

    }
}
