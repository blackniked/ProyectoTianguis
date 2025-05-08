import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { HeaderService } from '../../core/services/header.service';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { Producto } from '../../core/interfaces/productos';
import { TarjetaProductoComponent } from '../../core/components/tarjeta-producto/tarjeta-producto.component';
import { CommonModule } from '@angular/common';
import { TarjetaCategoriaComponent } from "../../core/components/tarjeta-categoria/tarjeta-categoria.component";
import { Categoria } from '../../core/interfaces/categorias';
import { VendedorService } from '../../core/services/vendedor.service';
//import { VendedorService } from '../../core/services/vendedor.service';

@Component({
  selector: 'app-productos-vendedor',
  standalone: true,
  imports: [TarjetaCategoriaComponent, RouterModule, CommonModule, TarjetaProductoComponent],
  templateUrl: './productos-vendedor.component.html',
  styleUrl: './productos-vendedor.component.css'
})
export class ProductosVendedorComponent implements OnInit {
//Aqui se inyectan los service
  headerService = inject(HeaderService);
 vendedorService = inject(VendedorService);
  categorias:WritableSignal<Categoria[]> = signal([]);
  productos: WritableSignal<Producto[]> = signal([]);
  selectedCategoriaId: WritableSignal<number | null> = signal(null);

  //Aqui se inician los services
  ngOnInit(): void {
    this.headerService.titulo.set("Productos Vendedor");
    this.vendedorService.getAll().then(res => this.categorias.set(res));
  }

  onCategorySelected(categoriaId: number): void {
    this.selectedCategoriaId.set(categoriaId);
    const vendedorId = 1; // Replace with dynamic vendedorId if needed
    this.vendedorService.getById(categoriaId).then(category => {
      if (category) {
        const productosFiltrados = category.productos.filter(producto => producto.vendedorId === vendedorId);
        this.productos.set(productosFiltrados);
      }
    });
  }
}
