import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { VideoConsultaPageRoutingModule } from './video-consulta-routing.module';
import { VideoConsultaPage } from './video-consulta.page';

// IMPORTA ComponentsModule
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideoConsultaPageRoutingModule,
    ComponentsModule 
  ],
  declarations: [VideoConsultaPage]
})
export class VideoConsultaPageModule {}
