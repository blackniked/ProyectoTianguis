import { Producto } from './../interfaces/productos';
import { Injectable } from '@angular/core';
import { Categoria } from '../interfaces/categorias';
import { Busqueda } from '../interfaces/busqueda';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor() { }

  //Primero leemos los datos, despues la respuesta html, despues de obtener las categorias usamos el find para encontrar la que sea 
  // el id igual al que recibi primero, y si se encuentra algo, buscamos los productos dentro de la categoria, si existen los productos los mostramos, si no un array vacio.
  async getByCategoria(id:number):Promise<Producto[]>{
    const res = await fetch('assets/data/database.json');
    const resJson:Categoria[] = await res.json();
    const productos = resJson.find(categoria => categoria.id === id)?.productos;
    if(productos) return productos;
    return[];
  }
  async getAll():Promise<Producto[]>{
    const res = await fetch('assets/data/database.json');
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

  //Aqui se deberia hacer un fetch al backend buscando todos los productos
  async buscar(parametros:Busqueda){
    const productos = await this.getAll();
    const productosFiltrados = productos.filter(producto => {
      //if(parametros.aptoCeliaco && !producto.esCeliaco) return false;
      //if(parametros.aptoVegano && !producto.esVegano) return false;
    
      const busquedaTitulo = producto.nombre.toLowerCase().includes(parametros.texto.toLowerCase());
     // console.log(busquedaTitulo)
      if(busquedaTitulo) return true;
    for (let i = 0; i < producto.descripciones.length; i++) {
      const descripcion = producto.descripciones[i];
      if(descripcion.toLowerCase().includes(parametros.texto.toLowerCase())) return true;
    }
      return false;
    })
    return productosFiltrados;
  }
}
