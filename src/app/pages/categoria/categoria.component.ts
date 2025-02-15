import { Component, inject } from '@angular/core';
import { HeaderService } from '../../core/services/header.service';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.css'
})
export class CategoriaComponent {
  headerService = inject(HeaderService);
  
    ngOnInit(): void {
      this.headerService.titulo.set("Categoria");
    }
}
