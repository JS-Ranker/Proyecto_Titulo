import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DuenosService } from '../../service/duenos.service';
import { MascotasService } from '../../service/mascotas.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.page.html',
  styleUrls: ['./userprofile.page.scss'],
  standalone: false
})
export class UserprofilePage implements OnInit {
  userData: any;
  mascotas: any[] = [];
  loading = true;
  error = '';
  success = '';
  today = new Date();
  editMode = false;
  editForm: FormGroup;
  editField: string | null = null;

  constructor(
    private duenosService: DuenosService,
    private mascotasService: MascotasService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.editForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      password: ['', [Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() { 
    const rut = localStorage.getItem('currentUserRut');
    if (!rut) {
      this.error = 'No se encontró información del usuario';
      this.loading = false;
      return; 
    }
    this.duenosService.getDuenoPorRut(rut).subscribe({
      next: (data: any) => {
        console.log('Datos usuario:', data); // <-- Agrega esto
        this.userData = data;
        this.editForm.patchValue({
          email: data.email,
          telefono: data.telefono,
          password: ''
        });
        this.mascotasService.obtenerMascotasPorDueno(rut).subscribe({
          next: (resp: any) => {
            this.mascotas = Array.isArray(resp) ? resp : (resp.data || []);
            this.loading = false;
          },
          error: () => {
            this.error = 'Error al cargar mascotas';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.error = 'Error al cargar usuario';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.editForm.invalid) return;
    this.loading = true;
    this.error = '';
    this.success = '';
    const rut = this.userData.rut;
    const { email, telefono, password } = this.editForm.value;
    // Solo envía la clave si fue modificada
    const updateData: any = { email, telefono };
    if (password && password.length >= 6) {
      updateData.password = password;
    }
    this.duenosService.actualizarDueno(rut, updateData).subscribe({
      next: () => {
        this.success = 'Perfil actualizado correctamente';
        this.editMode = false;
        this.loadUserData();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al actualizar perfil';
        this.loading = false;
      }
    });
  }

  cancelEdit() {
    this.editMode = false;
    this.error = '';
    this.success = '';
    this.editForm.patchValue({
      email: this.userData.email,
      telefono: this.userData.telefono,
      password: ''
    });
  }

  startEdit(field: string) {
    this.editField = field;
    this.editForm.patchValue({ [field]: this.userData[field] });
    if (field === 'password') {
      this.editForm.patchValue({ password: '' });
    }
  }

  cancelField() {
    this.editField = null;
    this.editForm.patchValue({
      email: this.userData.email,
      telefono: this.userData.telefono,
      password: ''
    });
  }

  saveField(field: string) {
    if (this.editForm.invalid) return;
    this.loading = true;
    this.error = '';
    this.success = '';
    const rut = this.userData.rut;

    // Usa los valores actuales si no se están editando
    const updateData: any = {
      rut: this.userData.rut,
      nombre: this.userData.nombre,
      apellido: this.userData.apellido,
      email: field === 'email' ? this.editForm.value.email : this.userData.email,
      telefono: field === 'telefono' ? this.editForm.value.telefono : this.userData.telefono,
      password: field === 'password'
        ? this.editForm.value.password
        : (this.userData.password || '123456') // Usa la clave actual o un valor por defecto si no existe
    };

    // Validación extra para password
    if (field === 'password' && (!updateData.password || updateData.password.length < 6)) {
      this.error = 'La clave debe tener al menos 6 caracteres';
      this.loading = false;
      return;
    }

    // Validación para telefono (opcional)
    if (!updateData.telefono) {
      this.error = 'El teléfono es requerido';
      this.loading = false;
      return;
    }

    this.duenosService.actualizarDueno(rut, updateData).subscribe({
      next: () => {
        this.success = 'Perfil actualizado correctamente';
        this.editField = null;
        this.loadUserData();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al actualizar perfil';
        this.loading = false;
      }
    });
  }

  goToPets() {
    this.router.navigate(['/pets']);
  }
}
