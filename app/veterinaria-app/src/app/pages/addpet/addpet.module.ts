import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddpetPageRoutingModule } from './addpet-routing.module';

import { AddpetPage } from './addpet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddpetPageRoutingModule
  ],
  declarations: [AddpetPage]
})
export class AddpetPageModule {}
