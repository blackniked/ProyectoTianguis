import { NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'tianguis-sidebar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
public oculto: boolean = false;
    ocultarSidebar(){
      this.oculto = true;
    }
    mostrarSidebar(){
      this.oculto = false;
    }


  }
