import { Component, OnInit } from '@angular/core';
import { CitasService } from '../../service/citas.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.page.html',
  styleUrls: ['./citas.page.scss'],
  standalone: false
})
export class CitasPage implements OnInit {
  citas: any[] = [];
  loading = true;
  modalOpen = false;
  citaCancelar: any = null;

  constructor(
    private citasService: CitasService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.cargarCitas();
  }

  cargarCitas() {
    this.loading = true;
    const userStr = localStorage.getItem('currentUser');
    const currentUser = userStr ? JSON.parse(userStr) : null;
    if (currentUser?.rut) {
      this.citasService.obtenerCitasPorDueno(currentUser.rut).subscribe({
        next: (res) => {
          this.citas = Array.isArray(res) ? res : [];
          this.loading = false;
        },
        error: () => {
          this.citas = [];
          this.loading = false;
        }
      });
    } else {
      this.citas = [];
      this.loading = false;
    }
  }

  getEstadoClass(estado: string) {
    const estadoLower = (estado || '').toLowerCase();
    if (estadoLower.includes('pendiente')) return 'estado-pendiente';
    if (estadoLower.includes('confirmada')) return 'estado-confirmada';
    if (estadoLower.includes('completada')) return 'estado-completada';
    if (estadoLower.includes('cancelada')) return 'estado-cancelada';
    return 'estado-pendiente';
  }

  handleCancelarClick(cita: any) {
    this.citaCancelar = cita;
    this.modalOpen = true;
  }

  handleCerrarModal() {
    this.modalOpen = false;
    this.citaCancelar = null;
  }

  async handleConfirmarCancelacion() {
    if (!this.citaCancelar) return;
    const alert = await this.alertController.create({
      header: 'Cancelar cita',
      message: '¿Seguro que deseas cancelar esta cita? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'No, volver',
          role: 'cancel'
        },
        {
          text: 'Sí, cancelar',
          handler: () => {
            this.citasService.cancelarCita(this.citaCancelar.id).subscribe({
              next: () => {
                this.citas = this.citas.map(c =>
                  c.id === this.citaCancelar.id ? { ...c, estado: 'cancelada' } : c
                );
                this.handleCerrarModal();
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
}
