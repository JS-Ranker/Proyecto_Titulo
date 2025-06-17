import { Component, OnInit } from '@angular/core';
import { MascotasService } from '../../service/mascotas.service';
import { Router } from '@angular/router';
import { IMG_BASE_URL } from 'src/app/service/api-config';

@Component({
  selector: 'app-pets',
  templateUrl: './pets.page.html',
  styleUrls: ['./pets.page.scss'],
  standalone: false
})
export class PetsPage implements OnInit {
  mascotas: any[] = [];
  loading = true;
  IMG_BASE_URL = IMG_BASE_URL;

  constructor(
    private mascotasService: MascotasService,
    public router: Router 
  ) {}

  ngOnInit() {
    this.loadMascotas();
  }

  loadMascotas() {
    const rut = localStorage.getItem('currentUserRut');
    if (!rut) {
      this.mascotas = [];
      this.loading = false;
      return;
    }
    this.mascotasService.obtenerMascotasPorDueno(rut).subscribe({
      next: (resp: any) => {
        this.mascotas = Array.isArray(resp) ? resp : (resp.data || []);
        this.loading = false;
      },
      error: () => {
        this.mascotas = [];
        this.loading = false;
      }
    });
  }

  goToAddPet() {
    this.router.navigate(['/addpet']);
  }

  calcularEdad(fecha: string): number {
    const nacimiento = new Date(fecha);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }
}
