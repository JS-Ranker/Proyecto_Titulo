import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

// Componentes reutilizables
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { CarouselbannerComponent } from '../components/carouselbanner/carouselbanner.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    CarouselbannerComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    CarouselbannerComponent
  ]
})
export class SharedModule {}