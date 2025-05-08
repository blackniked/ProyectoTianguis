import { Injectable } from '@angular/core';
import { Categoria } from '../interfaces/categorias';

@Injectable({
  providedIn: 'root'
})
export class VendedorService {

  constructor() { }

  async getAll():Promise<Categoria[]>{
    const res = await fetch("assets/data/database.json");
    const resJson = await res.json();
    return resJson;
  }

  async getById(id:number):Promise<Categoria | undefined>{
      const res = await fetch("assets/data/database.json");
      const resJson:Categoria[] = await res.json();
      const categoria = resJson.find(categoria => categoria.id === id);
      if(categoria) return categoria;
      return;
    }

    async getProductosByVendedor(vendedorId: number): Promise<any[]> {
      const res = await fetch("assets/data/database.json");
      const resJson = await res.json();
      const productosFiltrados: any[] = [];

      resJson.forEach((categoria: any) => {
        if (categoria.productos) {
          const productos = categoria.productos.filter((producto: any) => producto.vendedorId === vendedorId);
          productosFiltrados.push(...productos);
        }
      });

      return productosFiltrados;
    }
}