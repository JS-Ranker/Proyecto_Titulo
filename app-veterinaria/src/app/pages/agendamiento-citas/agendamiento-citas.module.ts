import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgendamientoCitasPageRoutingModule } from './agendamiento-citas-routing.module';

import { AgendamientoCitasPage } from './agendamiento-citas.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgendamientoCitasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AgendamientoCitasPage]
})
export class AgendamientoCitasPageModule {}
 