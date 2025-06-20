import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router'; 

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CarouselbannerComponent } from './carouselbanner/carouselbanner.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    CarouselbannerComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule // 👈 NECESARIO PARA USAR routerLink
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    CarouselbannerComponent
  ]
})
export class ComponentsModule {}
