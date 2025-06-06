import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { UserprofilePage } from './userprofile.page';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../../components/components.module';
import { BackButtonComponent } from '../../components/back-button/back-button.component'; // <-- Agrega este import

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: UserprofilePage }]),
    ComponentsModule,
    BackButtonComponent // <-- Agrega aquí el componente standalone
  ],
  declarations: [UserprofilePage]
})
export class UserprofilePageModule {}
