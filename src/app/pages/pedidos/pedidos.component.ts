import { Component, inject, OnInit } from '@angular/core';
import { HeaderService } from '../../core/services/header.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface PedidoArticulo{
  nombre: string;
  cantidad: number;
  precio: number;
}
interface Pedido {
  id: number;
  estatus: string;
  articulos: PedidoArticulo[];
}

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit {
  //Aqui se inyectan los service
  headerService = inject(HeaderService);
  
  pedidos: Pedido[] = [
    {
      id: 1,
      estatus: 'Enviado',
      articulos: [
        { nombre: 'Articulo 1', cantidad: 2, precio: 10 },
        { nombre: 'Articulo 2', cantidad: 1, precio: 20 }
      ]
    },
    {
      id: 2,
      estatus: 'Entregado',
      articulos: [
        { nombre: 'Articulo 3', cantidad: 1, precio: 15 },
        { nombre: 'Articulo 4', cantidad: 3, precio: 5 }
      ]
    }
  ];

  estatusOptions: string[] = ['Preparando','Enviado', 'Entregado', 'Cancelado'];

  constructor() { }
  ngOnInit(): void {
    this.headerService.titulo.set("Ver pedidos");
  }

  actualizarEstatus(pedido: Pedido, nuevoEstatus: string): void {
    pedido.estatus = nuevoEstatus;
    // Aquí puedes agregar lógica adicional para manejar el cambio de estatus, como enviar una solicitud a un servidor.
  }
  obtenerTotal(pedido: Pedido): number {
    return pedido.articulos.reduce((total, articulo) => total + (articulo.cantidad * articulo.precio), 0);
}
}
