import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'principal',
    pathMatch: 'full'
  },
  {
    path: 'addpet',
    loadChildren: () => import('./pages/addpet/addpet.module').then( m => m.AddpetPageModule)
  },
  {
    path: 'especialidadespage',
    loadChildren: () => import('./pages/especialidadespage/especialidadespage.module').then( m => m.EspecialidadespagePageModule)
  },
  {
    path: 'principal',
    loadChildren: () => import('./pages/principal/principal.module').then( m => m.PrincipalPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'pets',
    loadChildren: () => import('./pages/pets/pets.module').then( m => m.PetsPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'shop',
    loadChildren: () => import('./pages/shop/shop.module').then( m => m.ShopPageModule)
  },
  {
    path: 'userprofile',
    loadChildren: () => import('./pages/userprofile/userprofile.module').then( m => m.UserprofilePageModule)
  },
  {
    path: 'citas',
    loadChildren: () => import('./pages/citas/citas.module').then( m => m.CitasPageModule)
  },
  {
    path: 'video-consulta',
    loadChildren: () => import('./pages/video-consulta/video-consulta.module').then( m => m.VideoConsultaPageModule)
  },
  {
    path: 'agendamiento-citas',
    loadChildren: () => import('./pages/agendamiento-citas/agendamiento-citas.module').then( m => m.AgendamientoCitasPageModule)
  },
  {
    path: 'cardiologia',
    loadChildren: () => import('./pages/cardiologia/cardiologia.module').then( m => m.CardiologiaPageModule)
  },
  {
    path: 'endocrinologia',
    loadChildren: () => import('./pages/endocrinologia/endocrinologia.module').then( m => m.EndocrinologiaPageModule)
  },
  {
    path: 'gastroenterologia',
    loadChildren: () => import('./pages/gastroenterologia/gastroenterologia.module').then( m => m.GastroenterologiaPageModule)
  },
  {
    path: 'oncologia',
    loadChildren: () => import('./pages/oncologia/oncologia.module').then( m => m.OncologiaPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
