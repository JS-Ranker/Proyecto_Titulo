import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';
import { ComponentsModule } from '../../components/components.module'; // <-- importa el módulo de componentes

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LoginPageRoutingModule,
    ComponentsModule // <-- importa aquí el módulo de componentes
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
