import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { UserprofilePage } from './userprofile.page';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../../components/components.module'; 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: UserprofilePage }]),
    ComponentsModule 
  ],
  declarations: [UserprofilePage]
})
export class UserprofilePageModule {}
