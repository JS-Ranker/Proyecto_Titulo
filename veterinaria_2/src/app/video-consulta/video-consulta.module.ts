import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideoConsultaPageRoutingModule } from './video-consulta-routing.module';

import { VideoConsultaPage } from './video-consulta.page';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { AndroidPermissionsService } from '../services/android-permissions.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideoConsultaPageRoutingModule
  ],
  declarations: [VideoConsultaPage],
  providers: [
    AndroidPermissions,
    AndroidPermissionsService
  ]
})
export class VideoConsultaPageModule {}
