import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OncologiaPageRoutingModule } from './oncologia-routing.module';

import { OncologiaPage } from './oncologia.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OncologiaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [OncologiaPage]
})
export class OncologiaPageModule {}
