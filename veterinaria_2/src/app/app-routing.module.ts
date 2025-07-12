import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./user-profile/user-profile.module').then( m => m.UserProfilePageModule)
  },
  {
    path: 'mascotas-detalle/:id',
    loadChildren: () => import('./mascotas-detalle/mascotas-detalle.module').then( m => m.MascotasDetallePageModule)
  },
  {
    path: 'mascotas-lista',
    loadChildren: () => import('./mascotas-lista/mascotas-lista.module').then( m => m.MascotasListaPageModule)
  },
  {
    path: 'citas-agendadas',
    loadChildren: () => import('./citas-agendadas/citas-agendadas.module').then( m => m.CitasAgendadasPageModule)
  },
  {
    path: 'agendar-cita',
    loadChildren: () => import('./agendar-cita/agendar-cita.module').then( m => m.AgendarCitaPageModule)
  },
  {
    path: 'video-consulta',
    loadChildren: () => import('./video-consulta/video-consulta.module').then( m => m.VideoConsultaPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
