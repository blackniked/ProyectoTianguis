import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HeaderService } from '../../../core/services/header.service';

@Component({
  selector: 'app-articulo',
  standalone: true,
  imports: [],
  templateUrl: './articulo.component.html',
  styleUrl: './articulo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticuloComponent { 
    headerService = inject(HeaderService);
  
    ngOnInit(): void {
      this.headerService.titulo.set("Articulo");
    }
}
