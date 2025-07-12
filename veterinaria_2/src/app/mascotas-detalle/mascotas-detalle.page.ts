import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { MascotasService, Pet } from '../services/mascotas.service';
import { IMG_BASE_URL } from '../services/api-config';

@Component({
  selector: 'app-mascotas-detalle',
  templateUrl: './mascotas-detalle.page.html',
  styleUrls: ['./mascotas-detalle.page.scss'],
  standalone: false
})
export class MascotasDetallePage implements OnInit {
  mascota: Pet | null = null;
  loading: boolean = true;
  mascotaId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mascotasService: MascotasService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.mascotaId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.mascotaId) {
      this.cargarDatosMascota();
    } else {
      this.mostrarError('ID de mascota no válido');
      this.router.navigate(['/']);
    }
  }

  async cargarDatosMascota() {
    const loading = await this.loadingController.create({
      message: 'Cargando datos de la mascota...',
    });
    await loading.present();

    this.mascotasService.obtenerDatosCompletos(this.mascotaId).subscribe({
      next: (response) => {
        this.mascota = response.data;
        this.loading = false;
        loading.dismiss();
      },
      error: (error) => {
        console.error('Error al cargar mascota:', error);
        this.mostrarError('Error al cargar los datos de la mascota');
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

  calcularEdad(): string {
    if (!this.mascota?.fecha_nac_mascota) return 'No disponible';
    
    const fechaNacimiento = new Date(this.mascota.fecha_nac_mascota);
    const hoy = new Date();
    
    let años = hoy.getFullYear() - fechaNacimiento.getFullYear();
    let meses = hoy.getMonth() - fechaNacimiento.getMonth();
    
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

  formatearFecha(fecha: string | null | undefined): string {
    if (!fecha) return 'No disponible';
    return new Date(fecha).toLocaleDateString('es-ES');
  }

  getImagenMascota(): string {
    if (!this.mascota?.url_imagen_mascota) {
      return 'assets/images/default-pet.svg';
    }
    
    // Si ya es una URL completa, devolverla tal como está
    if (this.mascota.url_imagen_mascota.startsWith('http')) {
      return this.mascota.url_imagen_mascota;
    }
    
    // Si es una ruta relativa, agregar la URL base
    return `${IMG_BASE_URL}${this.mascota.url_imagen_mascota}`;
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/images/default-pet.svg';
    }
  }

  volver() {
    this.router.navigate(['/user-profile']);
  }
}
