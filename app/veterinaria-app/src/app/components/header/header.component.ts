import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone : false
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  scrolled = false;
  isLoggedIn = false; // Conecta con tu servicio de autenticación

  constructor(
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    // Aquí puedes suscribirte a tu servicio de autenticación
    // this.authService.isLoggedIn$.subscribe(status => this.isLoggedIn = status);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.scrolled = window.pageYOffset > 50;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  logout() {
    // Implementa tu lógica de logout aquí
    // this.authService.logout();
    this.isLoggedIn = false;
    this.closeMenu();
    this.router.navigate(['/']);
  }

  navigateTo(route: string) {
    this.closeMenu();
    this.router.navigate([route]);
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }
}