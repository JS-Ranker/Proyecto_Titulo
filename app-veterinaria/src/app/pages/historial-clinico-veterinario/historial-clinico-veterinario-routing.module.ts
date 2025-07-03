import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialClinicoVeterinarioPage } from './historial-clinico-veterinario.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialClinicoVeterinarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialClinicoVeterinarioPageRoutingModule {}
