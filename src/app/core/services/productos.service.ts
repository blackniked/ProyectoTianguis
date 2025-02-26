import { Injectable } from '@angular/core';
import { Producto } from '../interfaces/productos';
import { Categoria } from '../interfaces/categorias';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor() { }

  //Primero leemos los datos, despues la respuesta html, despues de obtener las categorias usamos el find para encontrar la que sea 
  // el id igual al que recibi primero, y si se encuentra algo, buscamos los productos dentro de la categoria, si existen los productos los mostramos, si no un array vacio.
  async getByCategoria(id:number):Promise<Producto[]>{
    const res = await fetch("/assets/data/database.json");
    const resJson:Categoria[] = await res.json();
    const productos = resJson.find(categoria => categoria.id === id)?.productos;
    if(productos) return productos;
    return[];
  }
  async getAll():Promise<Producto[]>{
    const res = await fetch("/assets/data/database.json");
    const resJson:Categoria[] = await res.json();
    let productos:Producto[] = [];
    resJson.forEach(categoria => {
      productos = [...productos, ...categoria.productos]
    })
    return productos;

  }
  async getById(id:number):Promise<Producto | undefined>{
   const productos = await this.getAll();
   const productoElegido = productos.find(producto => producto.id === id);
   return productoElegido ? productoElegido : undefined;

  }
}
