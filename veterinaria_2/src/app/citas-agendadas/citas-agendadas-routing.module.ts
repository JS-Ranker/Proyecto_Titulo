import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CitasAgendadasPage } from './citas-agendadas.page';

const routes: Routes = [
  {
    path: '',
    component: CitasAgendadasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CitasAgendadasPageRoutingModule {}
