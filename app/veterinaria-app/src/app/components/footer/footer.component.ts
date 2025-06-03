import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: false,
})
export class FooterComponent implements OnInit {
  currentYear: number;

  constructor() {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit() {}

  
  onLinkClick(route: string) {
    
    console.log('Navegando a:', route);
  }

  // Método para manejar clicks en redes sociales
  onSocialClick(platform: string) {
    
    console.log('Abriendo:', platform);
  }
}