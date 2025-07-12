import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { MascotasService, Pet } from '../services/mascotas.service';
import { IMG_BASE_URL } from '../services/api-config';

@Component({
  selector: 'app-mascotas-lista',
  templateUrl: './mascotas-lista.page.html',
  styleUrls: ['./mascotas-lista.page.scss'],
  standalone: false
})
export class MascotasListaPage implements OnInit {
  mascotas: Pet[] = [];
  loading: boolean = true;

  constructor(
    private router: Router,
    private mascotasService: MascotasService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.cargarMascotas();
  }

  async cargarMascotas() {
    const loading = await this.loadingController.create({
      message: 'Cargando mascotas...',
    });
    await loading.present();

    this.mascotasService.obtenerMascotas().subscribe({
      next: (response) => {
        this.mascotas = response.data;
        this.loading = false;
        loading.dismiss();
      },
      error: (error) => {
        console.error('Error al cargar mascotas:', error);
        this.mostrarError('Error al cargar las mascotas');
        this.loading = false;
        loading.dismiss();
      }
    });
  }

  async mostrarError(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  verDetalles(mascotaId: number) {
    this.router.navigate(['/mascotas-detalle', mascotaId]);
  }

  getImagenMascota(mascota: Pet): string {
    if (!mascota.url_imagen_mascota) {
      return 'assets/images/default-pet.svg';
    }
    
    // Si ya es una URL completa, devolverla tal como está
    if (mascota.url_imagen_mascota.startsWith('http')) {
      return mascota.url_imagen_mascota;
    }
    
    // Si es una ruta relativa, agregar la URL base
    return `${IMG_BASE_URL}${mascota.url_imagen_mascota}`;
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/images/default-pet.svg';
    }
  }

  calcularEdad(fechaNacimiento: string | null | undefined): string {
    if (!fechaNacimiento) return 'Edad desconocida';
    
    const fechaNac = new Date(fechaNacimiento);
    const hoy = new Date();
    
    let años = hoy.getFullYear() - fechaNac.getFullYear();
    let meses = hoy.getMonth() - fechaNac.getMonth();
    
    if (meses < 0) {
      años--;
      meses += 12;
    }
    
    if (años > 0) {
      return años === 1 ? '1 año' : `${años} años`;
    } else {
      return meses === 1 ? '1 mes' : `${meses} meses`;
    }
  }

  async doRefresh(event: any) {
    try {
      await this.cargarMascotas();
    } finally {
      event.target.complete();
    }
  }
}
