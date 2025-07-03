import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialClinicoVeterinarioPageRoutingModule } from './historial-clinico-veterinario-routing.module';

import { HistorialClinicoVeterinarioPage } from './historial-clinico-veterinario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialClinicoVeterinarioPageRoutingModule
  ],
  declarations: [HistorialClinicoVeterinarioPage]
})
export class HistorialClinicoVeterinarioPageModule {}
