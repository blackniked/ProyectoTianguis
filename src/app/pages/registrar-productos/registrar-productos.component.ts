import { Component, inject } from '@angular/core';
import { ProductosService } from '../../core/services/productos.service';
import { RegistroProdsService } from '../../core/services/registroprods.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registrar-productos',
  templateUrl: './registrar-productos.component.html',
  styleUrl: './registrar-productos.component.css',
  standalone: true,
  imports: [FormsModule]
})
export class RegistrarProductosComponent {
  productosService = inject(RegistroProdsService);

  producto = {
    nombre: '',
    descripcion: '',
    precio: null,
    peso: null,
    piezas: null,
    stock: null,    // Nuevo campo
    usuario: null
  };

  onSubmit() {
    this.productosService.registrarProducto({
      nombre: this.producto.nombre,
      precio: this.producto.precio,
      descripcion: this.producto.descripcion,
      peso: this.producto.peso,
      piezas: this.producto.piezas,
      stock: this.producto.stock,
      usuario: this.producto.usuario
    }).subscribe({
      next: res => alert('Producto registrado exitosamente'),
      error: err => alert('Error al registrar producto')
    });
  }
}
