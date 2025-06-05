import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DuenosService } from '../../service/duenos.service';
import { AuthService } from '../../service/auth.service';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  loginForm: FormGroup;
  showPassword = false;
  loading = false;
  error = '';
  showSuccessOverlay = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private duenosService: DuenosService,
    private authService: AuthService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    this.loginForm = this.fb.group({
      rut: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async presentSuccessToast() {
    const toast = await this.toastController.create({
      message: '¡Bienvenido!',
      duration: 1500,
      color: 'success',
      position: 'top',
      animated: true
    });
    await toast.present();
  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      header: '¡Bienvenido!',
      message: `<div style="font-size:3rem; color:var(--success);">
                  <ion-icon name="checkmark-circle"></ion-icon>
                </div>
                <div>Inicio de sesión exitoso</div>`,
      cssClass: 'success-alert',
      buttons: [],
      backdropDismiss: false,
      animated: true,
      mode: 'ios'
    });
    await alert.present();
    setTimeout(() => alert.dismiss(), 1200); // Se cierra solo tras 1.2s
  }

  formatRut(rut: string): string {
    rut = rut.replace(/[^\dkK]/gi, ''); // Elimina todo menos números y k/K
    rut = rut.replace(/^0+/, ''); // Elimina ceros iniciales
    if (rut.length <= 1) return rut;
    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1);
    return `${cuerpo}-${dv}`;
  }

  onRutInput(event: any) {
    const value = event.target.value;
    const formatted = this.formatRut(value);
    this.loginForm.get('rut')?.setValue(formatted, { emitEvent: false });
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = '';
    try {
      const response = await this.duenosService.login(this.loginForm.value).toPromise();
      this.authService.login(response.token);
      this.showSuccessOverlay = true;
      setTimeout(() => {
        this.showSuccessOverlay = false;
        this.router.navigate(['/principal']);
      }, 1500);
    } catch (e: any) {
      this.error = e?.error?.error || 'Error al iniciar sesión';
    }
    this.loading = false;
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
