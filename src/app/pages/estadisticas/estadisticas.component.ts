import { Component, inject } from '@angular/core';
import { HeaderService } from '../../core/services/header.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent {
  articuloMasVendido: { nombre: string; cantidadVendida: number } = {
    nombre: "Articulo 1",
    cantidadVendida: 100
  };

  headerService = inject(HeaderService);
  http = inject(HttpClient);

  graficaUrl: string | null = null;

  ngOnInit(): void {
    this.headerService.titulo.set("Ver estadisticas");
  }

  generarPrediccion() {
  this.http.get<any>('https://ez-market.shop/api/prediccion/')
    .subscribe({
      next: res => {
        this.graficaUrl = 'data:image/png;base64,' + res.img_base64;
      },
      error: err => {
        alert('Error al generar la predicción');
      }
    });
}

    // Si la API devuelve la imagen directamente como blob, usa este código en su lugar:
    // this.http.get('https://18.116.15.141/api/prediccion/', { responseType: 'blob' })
    //   .subscribe({
    //     next: blob => {
    //       this.graficaUrl = URL.createObjectURL(blob);
    //     },
    //     error: err => {
    //       alert('Error al generar la predicción');
    //     }
    //   });
  }

