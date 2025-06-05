import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DuenosService } from '../../service/duenos.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {
  registerForm: FormGroup;
  loading = false;
  success = false;
  error = '';
  showSuccessOverlay = false; 

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private duenosService: DuenosService,
    private authService: AuthService
  ) { 
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      rut: ['', [Validators.required /*, tuValidadorRut*/]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  async onSubmit() {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.error = '';
    try {
      await this.duenosService.register(this.registerForm.value).toPromise();
      this.showSuccessOverlay = true; // <-- muestra animación
      setTimeout(() => {
        this.showSuccessOverlay = false;
        this.router.navigate(['/login']); // <-- redirige al login
      }, 1500);
    } catch (e: any) {
      this.error = e?.error?.error || 'Error al registrar el usuario';
    }
    this.loading = false;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
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
    this.registerForm.get('rut')?.setValue(formatted, { emitEvent: false });
  }
}
