import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-buscar',
  standalone: true,
  imports: [],
  template: `<p>buscar works!</p>`,
  styleUrl: './buscar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuscarComponent { }
