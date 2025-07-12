import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MascotasDetallePage } from './mascotas-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: MascotasDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MascotasDetallePageRoutingModule {}
