import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EndocrinologiaPageRoutingModule } from './endocrinologia-routing.module';

import { EndocrinologiaPage } from './endocrinologia.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EndocrinologiaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [EndocrinologiaPage]
})
export class EndocrinologiaPageModule {}
