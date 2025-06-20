import { Component, OnInit } from '@angular/core';
import { CitasService } from '../../service/citas.service';

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
  currentUser: any = {};

  constructor(private citasService: CitasService) {}

  ngOnInit() {
    const user = localStorage.getItem('currentUser');
    this.currentUser = user ? JSON.parse(user) : {};
    if (this.currentUser?.rut) {
      this.citasService.obtenerCitasPorDueno(this.currentUser.rut).subscribe(citas => {
        this.citas = citas;
        this.loading = false;
      });
    } else {
      this.loading = false;
    }
  }

  getEstadoClass(estado: string) {
    const estadoLower = estado?.toLowerCase() || '';
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

  handleConfirmarCancelacion() {
    if (this.citaCancelar) {
      this.citasService.cancelarCita(this.citaCancelar.id).subscribe(() => {
        this.citas = this.citas.map(c =>
          c.id === this.citaCancelar.id ? { ...c, estado: 'cancelada' } : c
        );
        this.modalOpen = false;
        this.citaCancelar = null;
      });
    }
  }

  handleCerrarModal() {
    this.modalOpen = false;
    this.citaCancelar = null;
  }
}
