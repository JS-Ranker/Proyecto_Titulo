import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EspecialidadespagePageRoutingModule } from './especialidadespage-routing.module';

import { EspecialidadespagePage } from './especialidadespage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EspecialidadespagePageRoutingModule
  ],
  declarations: [EspecialidadespagePage]
})
export class EspecialidadespagePageModule {}
