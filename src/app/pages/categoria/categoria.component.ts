import { Component, inject } from '@angular/core';
import { HeaderService } from '../../core/services/header.service';
import { ProductosService } from '../../core/services/productos.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Producto } from '../../core/interfaces/productos';
import { TarjetaProductoComponent } from '../../core/components/tarjeta-producto/tarjeta-producto.component';
import { CommonModule } from '@angular/common';
import { CategoriasService } from '../../core/services/categorias.service';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [TarjetaProductoComponent, CommonModule, RouterModule],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent {
  headerService = inject(HeaderService);
  productosService = inject(ProductosService);
  categoriasService = inject(CategoriasService);
  // Para obtener el id de la categoria por medio de la ruta
  ac = inject(ActivatedRoute);
  productos:Producto[] = [];
  
    ngOnInit(): void {
      
      this.ac.params.subscribe(params => {
        if(params['id']){
          this.categoriasService.getById(parseInt(params['id']))
          .then(categoria =>{
            if(categoria) {
              this.productos = categoria.productos;
              this.headerService.titulo.set(categoria.nombre);
            }})
        }
      })
    }
}
