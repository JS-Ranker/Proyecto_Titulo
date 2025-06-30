import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Especialidad {
  nombre: string;
  descripcion: string;
  ruta: string;
}

@Component({
  selector: 'app-especialidadespage',
  templateUrl: './especialidadespage.page.html',
  styleUrls: ['./especialidadespage.page.scss'],
  standalone: false
})
export class EspecialidadespagePage {
  especialidades: Especialidad[] = [
    {
      nombre: 'Cardiología Veterinaria',
      descripcion: 'Diagnóstico y tratamiento de enfermedades del corazón y sistema circulatorio.',
      ruta: '/cardiologia'
    },
    {
      nombre: 'Endocrinología Veterinaria',
      descripcion: 'Tratamiento de desórdenes hormonales como diabetes y problemas tiroideos.',
      ruta: '/endocrinologia'
    },
    {
      nombre: 'Oncología Veterinaria',
      descripcion: 'Diagnóstico y tratamiento del cáncer en animales.',
      ruta: '/oncologia'
    },
    {
      nombre: 'Gastroenterología Veterinaria',
      descripcion: 'Enfermedades del sistema digestivo, hígado y páncreas.',
      ruta: '/gastroenterologia'
    }
    // Agrega más especialidades si lo deseas
  ];

  constructor(private router: Router) {}

  goTo(ruta: string) {
    this.router.navigate([ruta]);
  }

  agendarCita() {
    this.router.navigate(['/agendamiento-citas']);
  }

  videoConsulta() {
    this.router.navigate(['/videollamada']);
  }
}
