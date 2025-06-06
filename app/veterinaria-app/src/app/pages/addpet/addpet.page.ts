import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MascotasService } from '../../service/mascotas.service';
import { EspeciesService } from '../../service/especies.service';
import { RazasService } from '../../service/razas.service';

@Component({
  selector: 'app-addpet',
  templateUrl: './addpet.page.html',
  styleUrls: ['./addpet.page.scss'],
  standalone: false
})
export class AddpetPage implements OnInit {
  petForm: FormGroup;
  especies: any[] = [];
  razas: any[] = [];
  imagen: File | null = null; 
  mensaje: { tipo: 'exito' | 'error', texto: string } | null = null;
  loading = false;
  showSuccessOverlay = false;

  constructor(
    private fb: FormBuilder,
    private mascotasService: MascotasService,
    private especiesService: EspeciesService,
    private razasService: RazasService,
    public router: Router
  ) {
    this.petForm = this.fb.group({
      nombre_mascota: ['', Validators.required],
      id_especie: ['', Validators.required],
      id_raza: ['', Validators.required],
      fecha_nac_mascota: ['', Validators.required],
      peso_kg: ['', Validators.required],
      sexo_mascota: ['', Validators.required],
      esta_esterilizado: ['', Validators.required],
      color_mascota: [''],
      codigo_microchip: ['']
    });
  }

  ngOnInit() {
    this.loading = true; 
    this.especiesService.getAll().subscribe({
      next: (res) => {
        this.especies = Array.isArray(res) ? res : (res.data || []);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar especies:', err); 
        this.especies = [];
        this.loading = false;
        this.mensaje = { tipo: 'error', texto: 'Error al cargar los tipos de mascota. Por favor, inténtalo más tarde.' };
      }
    });
  }

  onEspecieChange(id_especie: number) {
    if (!id_especie) {
      this.razas = [];
      return;
    }
    
    this.loading = true;
    this.razasService.getByEspecie(id_especie).subscribe({
      next: (res) => {
        this.razas = Array.isArray(res) ? res : (res.data || []);
        this.petForm.patchValue({ id_raza: '' });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar razas:', err);
        this.razas = [];
        this.loading = false;
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files && event.target.files[0];
    this.imagen = file ? file : null;
  }

  onSubmit() {
    if (this.petForm.invalid) return;
    this.loading = true;
    const formData = new FormData();
    Object.entries(this.petForm.value).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    const rut = localStorage.getItem('currentUserRut');
    if (rut) formData.append('id_dueno', rut);
    if (this.imagen) formData.append('imagen', this.imagen);

    this.mascotasService.crearMascota(formData).subscribe({
      next: () => {
        this.mensaje = { tipo: 'exito', texto: '¡Mascota registrada con éxito!' };
        this.petForm.reset();
        this.imagen = null;
        this.loading = false;
        this.showSuccessOverlay = true;
        setTimeout(() => {
          this.showSuccessOverlay = false;
          this.router.navigate(['/pets']);
        }, 1500); // Muestra animación 1.5s antes de redirigir
      },
      error: (err) => {
        this.mensaje = { tipo: 'error', texto: err.error?.error || 'Error al registrar mascota' };
        this.loading = false;
      }
    });
  }
}
