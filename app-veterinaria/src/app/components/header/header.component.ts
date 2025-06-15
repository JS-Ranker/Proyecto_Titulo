import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../service/auth.service'; 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent {
  isMenuOpen = false;
  scrolled = false;
  isLoggedIn$ = this.authService.isLoggedIn$;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.scrolled = window.pageYOffset > 50;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }

  navigateTo(route: string) {
    this.closeMenu();
    this.router.navigate([route]);
  }

  async showLogoutConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'cancel-button'
        },
        {
          text: 'Sí',
          cssClass: 'confirm-button',
          handler: () => {
            this.confirmLogout();
          }
        }
      ],
      cssClass: 'logout-alert'
    });

    await alert.present();
  }

  confirmLogout() {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/']);
  }

  logout() {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/']);
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }
}