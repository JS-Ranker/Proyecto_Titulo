import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { UserprofilePage } from './userprofile.page';
import { ComponentsModule } from '../../components/components.module';
import { BackButtonComponent } from '../../components/back-button/back-button.component'; // <-- Agrega este import
import { UserprofilePageRoutingModule } from './userprofile-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComponentsModule,
    BackButtonComponent,
    UserprofilePageRoutingModule
  ],
  declarations: [UserprofilePage]
})
export class UserprofilePageModule {}
