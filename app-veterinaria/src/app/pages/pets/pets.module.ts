import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PetsPageRoutingModule } from './pets-routing.module';

import { PetsPage } from './pets.page';
import { ComponentsModule } from '../../components/components.module';
import { BackButtonComponent } from '../../components/back-button/back-button.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PetsPageRoutingModule,
    ComponentsModule,
    BackButtonComponent // <-- SOLO aquí
  ],
  declarations: [
    PetsPage
    // NO pongas BackButtonComponent aquí
  ]
})
export class PetsPageModule {}
 