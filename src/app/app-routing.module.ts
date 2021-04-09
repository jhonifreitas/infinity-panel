import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [

  { path: 'entrar', loadChildren: () => import('./modules/auth/auth.module').then( m => m.AuthModule) },

  { path: '', canActivate: [AuthGuard], loadChildren: () => import('./layout/layout.module').then( m => m.LayoutModule), children: [
    { path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then( m => m.DashboardModule) },
  ]},

  // ERROR PAGES
  { path: 'error/403', loadChildren: () => import('./modules/error/403/403.module').then( m => m.Error403Module) },
  { path: '**', loadChildren: () => import('./modules/error/404/404.module').then( m => m.Error404Module) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
