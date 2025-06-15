import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AddpetPageRoutingModule } from './addpet-routing.module';
import { AddpetPage } from './addpet.page';
import { ComponentsModule } from '../../components/components.module';
import { BackButtonComponent } from '../../components/back-button/back-button.component'; // <-- Agrega este import

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddpetPageRoutingModule,
    ComponentsModule,
    BackButtonComponent
  ],
  declarations: [AddpetPage]
})
export class AddpetPageModule {}
