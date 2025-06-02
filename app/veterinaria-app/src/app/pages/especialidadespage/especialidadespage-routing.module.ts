import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EspecialidadespagePage } from './especialidadespage.page';

const routes: Routes = [
  {
    path: '',
    component: EspecialidadespagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EspecialidadespagePageRoutingModule {}
