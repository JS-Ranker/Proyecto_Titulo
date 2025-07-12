import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController, ActionSheetController } from '@ionic/angular';
import { CitasService, Cita } from '../services/citas.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-citas-agendadas',
  templateUrl: './citas-agendadas.page.html',
  styleUrls: ['./citas-agendadas.page.scss'],
  standalone: false
})
export class CitasAgendadasPage implements OnInit {
  citas: Cita[] = [];
  loading: boolean = true;
  filterType: string = 'todas';

  constructor(
    private router: Router,
    private citasService: CitasService,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    this.cargarCitas();
  }

  ionViewWillEnter() {
    // Recargar citas al volver a entrar a la página
    this.cargarCitas();
  }

  async cargarCitas() {
    const loading = await this.loadingController.create({
      message: 'Cargando citas...',
    });
    await loading.present();

    const userRut = this.authService.getCurrentUserRut();
    if (!userRut) {
      await this.mostrarError('No se encontró información del usuario');
      this.router.navigate(['/login']);
      return;
    }

    this.citasService.obtenerCitasPorDueno(userRut).subscribe({
      next: (citas) => {
        this.citas = citas.sort((a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime());
        this.loading = false;
        loading.dismiss();
      },
      error: (error) => {
        console.error('Error al cargar citas:', error);
        this.mostrarError('Error al cargar las citas');
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

  get citasFiltradas(): Cita[] {
    if (this.filterType === 'todas') {
      return this.citas;
    }
    return this.citas.filter(cita => cita.estado === this.filterType);
  }

  formatearFecha(fecha: string): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatearHora(fecha: string): string {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getEstadoColor(estado: string | undefined): string {
    switch (estado) {
      case 'pendiente': return 'warning';
      case 'confirmada': return 'primary';
      case 'completada': return 'success';
      case 'cancelada': return 'danger';
      case 'no_asistio': return 'medium';
      default: return 'medium';
    }
  }

  getEstadoTexto(estado: string | undefined): string {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'confirmada': return 'Confirmada';
      case 'completada': return 'Completada';
      case 'cancelada': return 'Cancelada';
      case 'no_asistio': return 'No asistió';
      default: return estado || 'Sin estado';
    }
  }

  puedeSerCancelada(cita: Cita): boolean {
    const ahora = new Date();
    const fechaCita = new Date(cita.fecha_hora);
    const horasRestantes = (fechaCita.getTime() - ahora.getTime()) / (1000 * 60 * 60);
    
    return (cita.estado === 'pendiente' || cita.estado === 'confirmada') && horasRestantes > 2;
  }

  async mostrarOpcionesCita(cita: Cita) {
    const buttons = [];

    if (this.puedeSerCancelada(cita)) {
      buttons.push({
        text: 'Cancelar Cita',
        icon: 'close-circle',
        role: 'destructive',
        handler: () => {
          this.confirmarCancelacion(cita);
        }
      });
    }

    buttons.push({
      text: 'Ver Detalles',
      icon: 'information-circle',
      handler: () => {
        this.verDetalles(cita);
      }
    });

    buttons.push({
      text: 'Cerrar',
      icon: 'close',
      role: 'cancel'
    });

    const actionSheet = await this.actionSheetController.create({
      header: `Cita - ${cita.nombre_mascota}`,
      buttons: buttons
    });

    await actionSheet.present();
  }

  async confirmarCancelacion(cita: Cita) {
    const alert = await this.alertController.create({
      header: 'Confirmar Cancelación',
      message: `¿Estás seguro de que quieres cancelar la cita de ${cita.nombre_mascota} programada para el ${this.formatearFecha(cita.fecha_hora)} a las ${this.formatearHora(cita.fecha_hora)}?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí, cancelar',
          handler: () => {
            this.cancelarCita(cita);
          }
        }
      ]
    });

    await alert.present();
  }

  async cancelarCita(cita: Cita) {
    const loading = await this.loadingController.create({
      message: 'Cancelando cita...',
    });
    await loading.present();

    this.citasService.cancelarCita(cita.id!).subscribe({
      next: () => {
        loading.dismiss();
        this.mostrarExito('Cita cancelada correctamente');
        this.cargarCitas(); // Recargar las citas
      },
      error: (error) => {
        console.error('Error al cancelar cita:', error);
        loading.dismiss();
        this.mostrarError('Error al cancelar la cita');
      }
    });
  }

  async mostrarExito(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  verDetalles(cita: Cita) {
    // TODO: Implementar página de detalles de cita
    console.log('Ver detalles de cita:', cita);
  }

  navigateToAgendar() {
    this.router.navigate(['/agendar-cita']);
  }

  iniciarVideoConsulta(cita: Cita) {
    // Generar nombre del canal basado en la cita
    const canalNombre = `cita-${cita.id}-${Date.now()}`;
    
    // Navegar a la página de video consulta con el canal
    this.router.navigate(['/video-consulta'], {
      queryParams: { canal: canalNombre }
    });
  }

  async doRefresh(event: any) {
    try {
      await this.cargarCitas();
    } finally {
      event.target.complete();
    }
  }
}
