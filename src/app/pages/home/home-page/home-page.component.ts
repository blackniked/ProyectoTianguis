import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { HeaderService } from '../../../core/services/header.service';
import { CategoriasService } from '../../../core/services/categorias.service';
import { Categoria } from '../../../core/interfaces/categorias';
import { TarjetaCategoriaComponent } from "../../../core/components/tarjeta-categoria/tarjeta-categoria.component";
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';


@Component({
  selector: 'tianguis-home-page',
  standalone: true,
  imports: [TarjetaCategoriaComponent, CommonModule, RouterModule,RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
// Aqui usamos en OnInit para que el headerService cambie el titulo a home
export class HomePageComponent implements OnInit, OnDestroy{
  //Aqui se inyectan los service
  headerService = inject(HeaderService);
  categoriasService = inject(CategoriasService);
  categorias:WritableSignal<Categoria[]> = signal([]);

  //Aqui se inician los services
  ngOnInit(): void {
    this.headerService.titulo.set("EzMarket");
    this.headerService.extendido.set(true);
    this.categoriasService.getAll().then(res => this.categorias.set(res))
  }

  //Para deshabilitar el extendido del header
  ngOnDestroy(): void {
    this.headerService.extendido.set(false);
  }
}
