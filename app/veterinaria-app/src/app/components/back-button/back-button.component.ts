import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class BackButtonComponent {
  // Ruta específica a donde navegar (opcional)
  @Input() navigateTo: string = '';
  
  // Usar navegación del navegador (historial) en lugar de ruta específica
  @Input() useHistory: boolean = false;
  
  // Texto del tooltip (opcional)
  @Input() tooltip: string = 'Volver';
  
  // Tamaño del botón
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  
  // Tema del botón
  @Input() theme: 'light' | 'dark' | 'primary' = 'light';
  
  // Mostrar texto junto al icono (opcional)
  @Input() showText: boolean = false;
  @Input() text: string = 'Volver';

  constructor(
    private router: Router,
    private location: Location
  ) {}

  onBackClick(): void {
    if (this.useHistory) {
      // Usar el historial del navegador
      this.location.back();
    } else if (this.navigateTo) {
      // Navegar a ruta específica
      this.router.navigate([this.navigateTo]);
    } else {
      // Por defecto, usar historial
      this.location.back();
    }
  }

  getSizeClass(): string {
    return `back-btn-${this.size}`;
  }

  getThemeClass(): string {
    return `back-btn-${this.theme}`;
  }
}