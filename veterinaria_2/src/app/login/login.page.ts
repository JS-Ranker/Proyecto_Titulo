import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService, LoginData } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  loginData: LoginData = {
    rut: '',
    password: ''
  };

  showPassword = false;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    // Verificar si ya está logueado usando el patrón de app-veterinaria
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/user-profile']);
      }
    });
  }



  formatRut(event: any) {
    let value = event.target.value;
    // Eliminar cualquier carácter que no sea número o K/k
    let cleaned = value.replace(/[^0-9kK]/g, '');
    
    // Convertir a mayúscula si termina en k
    if (cleaned.toLowerCase().endsWith('k')) {
      cleaned = cleaned.slice(0, -1) + 'K';
    }
    
    // Si tiene largo suficiente para añadir guión (>1)
    if (cleaned.length > 1) {
      // Separa el dígito verificador
      const body = cleaned.slice(0, -1);
      const dv = cleaned.slice(-1);
      this.loginData.rut = `${body}-${dv}`;
    } else {
      this.loginData.rut = cleaned;
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onLogin() {
    if (!this.loginData.rut || !this.loginData.password) {
      await this.showToast('Por favor complete todos los campos', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Verificando credenciales...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      this.isLoading = true;
      
      // Usar el patrón de app-veterinaria
      this.authService.login(this.loginData).subscribe({
        next: (user: any) => {
          loading.dismiss();
          this.showToast('¡Inicio de sesión exitoso!', 'success');
          
          // Navegar después de un breve delay
          setTimeout(() => {
            this.router.navigate(['/user-profile']);
          }, 1000);
        },
        error: (err) => {
          loading.dismiss();
          console.error('Error en login:', err);
          
          const errorMessage = err?.error?.error || 'Error al iniciar sesión. Verifique sus credenciales.';
          this.showAlert('Error de autenticación', errorMessage);
        }
      });
      
    } catch (error: any) {
      await loading.dismiss();
      console.error('Error en login:', error);
      
      const errorMessage = error?.error?.error || 'Error al iniciar sesión. Verifique sus credenciales.';
      await this.showAlert('Error de autenticación', errorMessage);
    } finally {
      this.isLoading = false;
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }

  navigateToRegister() {
    // Implementar navegación al registro cuando esté disponible
    console.log('Navegar a registro');
  }

}
