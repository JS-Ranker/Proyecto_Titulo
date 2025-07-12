import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { CitasService, CreateCitaData, TipoConsulta, Veterinario } from '../services/citas.service';
import { MascotasService, Pet } from '../services/mascotas.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-agendar-cita',
  templateUrl: './agendar-cita.page.html',
  styleUrls: ['./agendar-cita.page.scss'],
  standalone: false
})
export class AgendarCitaPage implements OnInit {
  mascotas: Pet[] = [];
  tiposConsulta: TipoConsulta[] = [];
  veterinarios: Veterinario[] = [];
  
  citaData: CreateCitaData = {
    mascota_id: 0,
    veterinario_id: null,
    tipo_consulta_id: null,
    fecha_hora: '',
    duracion_minutos: 30,
    motivo: '',
    notas_previas: ''
  };

  loading: boolean = true;
  minDate: string = '';
  maxDate: string = '';

  constructor(
    private router: Router,
    private citasService: CitasService,
    private mascotasService: MascotasService,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    // Configurar fechas mínima y máxima
    const hoy = new Date();
    this.minDate = hoy.toISOString();
    
    const maxFecha = new Date();
    maxFecha.setMonth(maxFecha.getMonth() + 3); // 3 meses adelante
    this.maxDate = maxFecha.toISOString();
  }

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    const loading = await this.loadingController.create({
      message: 'Cargando información...',
    });
    await loading.present();

    try {
      await this.cargarMascotas();
      await this.cargarTiposConsulta();
      await this.cargarVeterinarios();
    } catch (error) {
      console.error('Error al cargar datos:', error);
      await this.mostrarError('Error al cargar la información necesaria');
    } finally {
      this.loading = false;
      loading.dismiss();
    }
  }

  async cargarMascotas() {
    const userRut = this.authService.getCurrentUserRut();
    if (!userRut) {
      throw new Error('No se encontró información del usuario');
    }

    return new Promise<void>((resolve, reject) => {
      this.mascotasService.obtenerMascotasPorDueno(userRut).subscribe({
        next: (mascotas) => {
          this.mascotas = mascotas.filter(m => m.estado_activo);
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar mascotas:', error);
          reject(error);
        }
      });
    });
  }

  async cargarTiposConsulta() {
    return new Promise<void>((resolve, reject) => {
      this.citasService.obtenerTiposConsulta().subscribe({
        next: (tipos) => {
          this.tiposConsulta = tipos;
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar tipos de consulta:', error);
          // No es crítico, continuar sin tipos
          resolve();
        }
      });
    });
  }

  async cargarVeterinarios() {
    return new Promise<void>((resolve, reject) => {
      this.citasService.obtenerVeterinarios().subscribe({
        next: (veterinarios) => {
          this.veterinarios = veterinarios;
          resolve();
        },
        error: (error) => {
          console.error('Error al cargar veterinarios:', error);
          // No es crítico, continuar sin veterinarios
          resolve();
        }
      });
    });
  }

  onTipoConsultaChange() {
    const tipoSeleccionado = this.tiposConsulta.find(t => t.id === this.citaData.tipo_consulta_id);
    if (tipoSeleccionado && tipoSeleccionado.duracion_estimada) {
      this.citaData.duracion_minutos = tipoSeleccionado.duracion_estimada;
    }
  }

  async validarFormulario(): Promise<boolean> {
    if (!this.citaData.mascota_id) {
      await this.mostrarError('Debes seleccionar una mascota');
      return false;
    }

    if (!this.citaData.fecha_hora) {
      await this.mostrarError('Debes seleccionar fecha y hora');
      return false;
    }

    // Validar que la fecha sea futura
    const fechaSeleccionada = new Date(this.citaData.fecha_hora);
    const ahora = new Date();
    
    if (fechaSeleccionada <= ahora) {
      await this.mostrarError('La fecha y hora deben ser futuras');
      return false;
    }

    // Validar horario de atención (ejemplo: 8:00 AM a 6:00 PM)
    const hora = fechaSeleccionada.getHours();
    if (hora < 8 || hora >= 18) {
      await this.mostrarError('Solo se pueden agendar citas entre 8:00 AM y 6:00 PM');
      return false;
    }

    return true;
  }

  async agendarCita() {
    if (!(await this.validarFormulario())) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Agendando cita...',
    });
    await loading.present();

    this.citasService.crearCita(this.citaData).subscribe({
      next: async (response) => {
        loading.dismiss();
        await this.mostrarExito('Cita agendada correctamente');
        this.router.navigate(['/citas-agendadas']);
      },
      error: async (error) => {
        loading.dismiss();
        console.error('Error al agendar cita:', error);
        await this.mostrarError(error.error?.error || 'Error al agendar la cita');
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

  async mostrarExito(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  limpiarFormulario() {
    this.citaData = {
      mascota_id: 0,
      veterinario_id: null,
      tipo_consulta_id: null,
      fecha_hora: '',
      duracion_minutos: 30,
      motivo: '',
      notas_previas: ''
    };
  }

  navegarACitas() {
    this.router.navigate(['/citas-agendadas']);
  }

  async iniciarVideoConsultaInmediata() {
    if (!this.citaData.mascota_id) {
      await this.mostrarError('Debes seleccionar una mascota para la video consulta');
      return;
    }

    const mascotaSeleccionada = this.mascotas.find(m => m.id_mascota === this.citaData.mascota_id);
    
    const alert = await this.alertController.create({
      header: 'Video Consulta Inmediata',
      message: `¿Deseas iniciar una video consulta inmediata para ${mascotaSeleccionada?.nombre_mascota || 'tu mascota'}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Iniciar',
          handler: () => {
            // Generar nombre del canal
            const canalNombre = `consulta-inmediata-${this.citaData.mascota_id}-${Date.now()}`;
            
            // Navegar a video consulta
            this.router.navigate(['/video-consulta'], {
              queryParams: { canal: canalNombre }
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
