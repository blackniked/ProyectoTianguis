import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HeaderService } from '../../core/services/header.service';

@Component({
  selector: 'app-buscar',
  standalone: true,
  imports: [],
  templateUrl: './buscar.component.html',
  styleUrl: './buscar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuscarComponent { 
    headerService = inject(HeaderService);
  
    ngOnInit(): void {
      this.headerService.titulo.set("Buscar");
    }
}
