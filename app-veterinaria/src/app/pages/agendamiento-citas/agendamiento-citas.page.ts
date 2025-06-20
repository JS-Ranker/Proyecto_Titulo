import { Component, OnInit } from '@angular/core';
import { MascotasService } from '../../service/mascotas.service';
import { TiposConsultaService } from '../../service/tipos_consultas.service'; // <- nombre correcto
import { VeterinariosService } from '../../service/veterinarios.service';
import { CitasService } from '../../service/citas.service';
import { Router } from '@angular/router';
import { DuenosService } from '../../service/duenos.service'; // <-- Agrega esto

@Component({
  selector: 'app-agendamiento-citas',
  templateUrl: './agendamiento-citas.page.html',
  styleUrls: ['./agendamiento-citas.page.scss'],
  standalone: false
})
export class AgendamientoCitasPage implements OnInit {
  step = 1;
  currentUser: any = {};
  mascotas: any[] = [];
  selectedMascota: any = null;
  tiposConsulta: any[] = [];
  selectedTipoConsulta: any = null;
  veterinarios: any[] = [];
  selectedVeterinario: any = null;
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  selectedDate: Date | null = null;
  selectedTime: string | null = null;
  motivo = '';
  notasPrevias = '';
  isSubmitted = false;
  loading = false;

  timeSlots = [
    '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
    '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
    '16:00 - 17:00', '17:00 - 18:00'
  ];

  availableYears = Array.from({ length: 3 }, (_, i) => new Date().getFullYear() + i);

  constructor(
    private mascotasService: MascotasService,
    private tiposConsultaService: TiposConsultaService,
    private veterinariosService: VeterinariosService,
    private citasService: CitasService,
    private duenosService: DuenosService, // <-- Agrega esto
    private router: Router
  ) {}

  ngOnInit() {
    // Obtén el RUT desde el localStorage
    const user = localStorage.getItem('currentUser');
    this.currentUser = user ? JSON.parse(user) : {};
    const rut = this.currentUser?.rut || localStorage.getItem('currentUserRut');
    if (rut) {
      // Carga los datos completos del usuario
      this.duenosService.getDuenoPorRut(rut).subscribe((data: any) => {
        this.currentUser = data;
        // Ahora carga las mascotas asociadas al usuario
        this.mascotasService.obtenerMascotasPorDueno(rut).subscribe((res: any) => {
          this.mascotas = res.data || res;
        });
      });
    }
    this.tiposConsultaService.obtenerTodos().subscribe((res: any) => this.tiposConsulta = res);
  }

  onMascotaChange(id: string) {
    this.selectedMascota = id;
  }

  onTipoConsultaChange(tipo: any) {
    this.selectedTipoConsulta = tipo;
    if (tipo?.id) {
      this.veterinariosService.obtenerPorEspecialidad(tipo.id).subscribe(vets => {
        this.veterinarios = vets;
        this.selectedVeterinario = vets[0] || null;
      });
    } else {
      this.veterinarios = [];
      this.selectedVeterinario = null;
    }
  }

  getMonthName(monthIndex: number) {
    return new Date(this.currentYear, monthIndex).toLocaleString('es-ES', { month: 'long' });
  }

  generateCalendarDays() {
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(this.currentYear, this.currentMonth, i));
    return days;
  }

  handleMonthChange(increment: number) {
    let newMonth = this.currentMonth + increment;
    let newYear = this.currentYear;
    if (newMonth > 11) { newMonth = 0; newYear++; }
    else if (newMonth < 0) { newMonth = 11; newYear--; }
    this.currentMonth = newMonth;
    this.currentYear = newYear;
  }

  handleYearChange(year: string) {
    this.currentYear = Number(year);
  }

  handleDateSelect(date: Date | null) {
    if (date) this.selectedDate = date;
  }

  nextStep() { if (this.step < 3) this.step++; }
  prevStep() { if (this.step > 1) this.step--; }

  submitCita() {
    if (!this.selectedMascota || !this.selectedTipoConsulta || !this.selectedDate || !this.selectedTime) return;
    this.loading = true;
    const cita = {
      mascota_id: this.selectedMascota.id_mascota,
      veterinario_id: this.selectedVeterinario?.id ?? null,
      tipo_consulta_id: this.selectedTipoConsulta?.id ?? null,
      fecha_hora: `${this.selectedDate.toISOString().split('T')[0]}T${this.selectedTime.split(' - ')[0]}:00`,
      motivo: this.motivo,
      notas_previas: this.notasPrevias,
      estado: 'pendiente'
    };
    this.citasService.crearCita(cita).subscribe({
      next: () => {
        this.isSubmitted = true;
        this.loading = false;
        setTimeout(() => this.router.navigate(['/']), 3000);
      },
      error: () => {
        this.loading = false;
        alert('Error al agendar la cita');
      }
    });
  }

  get mascotaSeleccionada() {
    return this.mascotas.find(m => m.id_mascota == this.selectedMascota);
  }

  get edadMascotaSeleccionada() {
    const mascota = this.mascotaSeleccionada;
    if (mascota?.fecha_nac_mascota) {
      const nac = new Date(mascota.fecha_nac_mascota).getTime();
      const now = Date.now();
      const edad = Math.floor((now - nac) / (1000 * 60 * 60 * 24 * 365));
      return `${edad} años`;
    }
    return 'No registrada';
  }
 
  get now() {
    return Date.now();
  }
}
