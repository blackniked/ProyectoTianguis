import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SidebarComponent } from '../../../../shared/components/sidebar/sidebar.component';
import { HeaderService } from '../../../../core/services/header.service';

@Component({
  selector: 'tianguis-home-page',
  standalone: true,
  imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
// Aqui usamos en OnInit para que el headerServide cambie el titulo a home
export class HomePageComponent implements OnInit, OnDestroy{
  
  headerService = inject(HeaderService);

  ngOnInit(): void {
    this.headerService.titulo.set("Inicio");
    this.headerService.extendido.set(true);
  }

  //Para deshabilitar el extendido del header
  ngOnDestroy(): void {
    this.headerService.extendido.set(false);
  }
}
