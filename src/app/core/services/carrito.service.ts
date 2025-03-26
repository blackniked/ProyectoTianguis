import { Injectable } from '@angular/core';
import { Carrito } from '../interfaces/carrito';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  constructor() {
   const cart = localStorage.getItem("carrito");
   if(cart) {
    const carritoGuardado = JSON.parse(cart);
    if(carritoGuardado){
      const fechaGuardado = new Date(carritoGuardado.fecha);
      const fecha = new Date();
      const dias = 4 //Dias de vencimiento del carrito
      if(fecha.getTime() - fechaGuardado.getTime() > 1000*60*60*24*dias){
        this.vaciar();
      }else{
        this.carrito = carritoGuardado.productos;
      }
       
     }
    
    }
   }

  carrito: Carrito[] = []

agregarProducto(idProducto:number, cantidad: number, notas:string){
 const i = this.carrito.findIndex(producto => producto.idProducto === idProducto);
 if(i === -1){
  const nuevoProducto:Carrito = {idProducto:idProducto, cantidad:cantidad, notas:notas};
  this.carrito.push(nuevoProducto);
 }else {
  this.carrito[i].cantidad += cantidad;
 }
 this.actualizarAlmacenamiento();
}
eliminarProducto(idProducto:number){
  this.carrito = this.carrito.filter(producto => producto.idProducto !== idProducto);
  if(this.carrito.length === 0) return localStorage.removeItem("carrito");
  this.actualizarAlmacenamiento();
}
cambiarCantidadProducto(idProducto:number, cantidad: number){
  this.carrito = this.carrito.map(producto => {
    const productoActual = producto;
    if(productoActual.idProducto === idProducto) productoActual.cantidad = cantidad;
    return productoActual;
  })
  this.actualizarAlmacenamiento();
}

actualizarAlmacenamiento(){
  const fecha = new Date();
  const elementoAGuardar = {
    fecha,
    productos:this.carrito
  }
  localStorage.setItem("carrito",JSON.stringify(elementoAGuardar));
}


vaciar(){
  this.carrito = [];
  localStorage.removeItem("carrito");
}
}
