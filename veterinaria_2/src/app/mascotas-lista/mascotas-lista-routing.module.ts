import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MascotasListaPage } from './mascotas-lista.page';

const routes: Routes = [
  {
    path: '',
    component: MascotasListaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MascotasListaPageRoutingModule {}
