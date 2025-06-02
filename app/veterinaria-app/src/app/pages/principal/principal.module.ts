import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrincipalPageRoutingModule } from './principal-routing.module';

import { PrincipalPage } from './principal.page';
import { SharedModule } from '../../shared/shared.module'; // Importa el SharedModule

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrincipalPageRoutingModule,
    SharedModule // Usa el SharedModule
  ],
  declarations: [
    PrincipalPage // Solo declara la página principal
  ]
})
export class PrincipalPageModule {}