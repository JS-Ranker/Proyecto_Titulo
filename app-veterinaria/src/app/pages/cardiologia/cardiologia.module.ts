import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CardiologiaPageRoutingModule } from './cardiologia-routing.module';

import { CardiologiaPage } from './cardiologia.page';

// IMPORTA ComponentsModule
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CardiologiaPageRoutingModule,
    ComponentsModule 
  ],
  declarations: [CardiologiaPage]
})
export class CardiologiaPageModule {}
