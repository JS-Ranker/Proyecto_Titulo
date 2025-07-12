import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MascotasDetallePageRoutingModule } from './mascotas-detalle-routing.module';

import { MascotasDetallePage } from './mascotas-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MascotasDetallePageRoutingModule
  ],
  declarations: [MascotasDetallePage]
})
export class MascotasDetallePageModule {}
