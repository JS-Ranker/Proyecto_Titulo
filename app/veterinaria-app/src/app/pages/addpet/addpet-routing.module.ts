import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddpetPage } from './addpet.page';

const routes: Routes = [
  {
    path: '',
    component: AddpetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddpetPageRoutingModule {}
