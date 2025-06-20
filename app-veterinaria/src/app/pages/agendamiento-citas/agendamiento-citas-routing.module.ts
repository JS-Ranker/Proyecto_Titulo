import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgendamientoCitasPage } from './agendamiento-citas.page';

const routes: Routes = [
  {
    path: '',
    component: AgendamientoCitasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendamientoCitasPageRoutingModule {}
