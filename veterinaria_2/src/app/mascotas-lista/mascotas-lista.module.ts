import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MascotasListaPageRoutingModule } from './mascotas-lista-routing.module';

import { MascotasListaPage } from './mascotas-lista.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MascotasListaPageRoutingModule
  ],
  declarations: [MascotasListaPage]
})
export class MascotasListaPageModule {}
