import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CitasAgendadasPageRoutingModule } from './citas-agendadas-routing.module';

import { CitasAgendadasPage } from './citas-agendadas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CitasAgendadasPageRoutingModule
  ],
  declarations: [CitasAgendadasPage]
})
export class CitasAgendadasPageModule {}
