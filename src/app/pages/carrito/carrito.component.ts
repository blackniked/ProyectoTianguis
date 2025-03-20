import { Component, ElementRef, inject, signal, ViewChild, viewChild, WritableSignal } from '@angular/core';
import { HeaderService } from '../../core/services/header.service';
import { CarritoService } from '../../core/services/carrito.service';
import { CommonModule } from '@angular/common';
import { ContadorCantidadComponent } from "../../core/components/contador-cantidad/contador-cantidad.component";
import { Producto } from '../../core/interfaces/productos';
import { ProductosService } from '../../core/services/productos.service';
import { Router, RouterModule } from '@angular/router';
import { PerfilService } from '../../core/services/perfil.service';
import { NUMERO_WHATSAPP } from '../../core/constantes/telefono';


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
  perfilService = inject(PerfilService);
  router = inject(Router);

productosCarrito:WritableSignal<Producto[]> = signal([]);

subtotal = 0;
delivery = 100;
total = 0;
@ViewChild("dialog") dialog!: ElementRef<HTMLDialogElement>;


  ngOnInit(): void {
    this.headerService.titulo.set("Carrito");
    //Aqui obtenemos los datos para los productos del carrito
    this.carritoService.carrito.forEach(async itemCarrito =>{
      const res = await this.productosService.getById(itemCarrito.idProducto)
      if(res) this.productosCarrito.set([...this.productosCarrito(), res]);
      this.calcularInformacion();
    })
  }

  eliminarProducto(idProducto:number){
    this.carritoService.eliminarProducto(idProducto);
  }

  calcularInformacion() {
    this.subtotal = 0;
    for (let i = 0; i < this.carritoService.carrito.length;i++) {
      this.subtotal += this.productosCarrito()[i].precio * this.carritoService.carrito[i].cantidad; 
      }
      this.total = this.subtotal + this.delivery;
  }

  cambiarCantidadProducto(id:number, cantidad:number){
    this.carritoService.cambiarCantidadProducto(id, cantidad)
    this.calcularInformacion();
  }

  async enviarMensaje(){
    let pedido =""
    for (let i = 0; i < this.carritoService.carrito.length; i++) {
      const producto = await this.productosService.getById(this.carritoService.carrito[i].idProducto);
      pedido += `* ${this.carritoService.carrito[i].cantidad} X ${producto?.nombre}
`
      
    }
    const mensaje = `
 Hola! Soy ${this.perfilService.perfil()?.nombre}, y te quiero hacer el siguiente pedido:
${pedido}
Si te quieres comunicar conmigo hazlo al numero del que te mande este mensaje o al ${this.perfilService.perfil()?.telefono}
La direccion de entrega es: ${this.perfilService.perfil()?.direccion} - ${this.perfilService.perfil()?.detalleEntrega}
Muchas gracias.
`
    const link = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURI(mensaje)}`
    window.open(link,"_blank");
    this.dialog.nativeElement.showModal();
  }

  finalizarPedido(){
    this.carritoService.vaciar();
    this.dialog.nativeElement.close();
    this.router.navigate(['/']);
  }

  editarPedido(){
    this.dialog.nativeElement.close();
  }
 

}


