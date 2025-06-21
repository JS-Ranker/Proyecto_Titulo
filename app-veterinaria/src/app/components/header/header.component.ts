import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; // <--- IMPORTA NavigationEnd
import { AuthService } from '../../service/auth.service'; 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false 
})
export class HeaderComponent {
  mobileMenuOpen = false;
  scrolled = false;
  showModal = false;
  isLoggedIn = false;

  constructor(private router: Router, private authService: AuthService) {
    this.checkAuthStatus();

  
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkAuthStatus();
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 50;
  }

  checkAuthStatus() {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  toggleMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : 'unset';
  } 

  // Cierra el menú después de un pequeño delay para asegurar la navegación
  closeMenuAfterDelay() {
    setTimeout(() => {
      this.mobileMenuOpen = false;
      document.body.style.overflow = 'unset';
    }, 150);
  }

  showLogoutModal() {
    this.showModal = true;
    this.mobileMenuOpen = false;
  }

  confirmLogout() { 
    this.authService.logout(); 
    localStorage.removeItem('token');
    localStorage.removeItem('currentUserRut');
    this.showModal = false;
    this.isLoggedIn = false;
    this.router.navigate(['/login']); 
  }

  closeModal() {
    this.showModal = false;
  }
}