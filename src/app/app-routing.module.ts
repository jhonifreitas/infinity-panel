import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

import { LayoutComponent } from './layout/layout.component';
import { UserListComponent } from './modules/user/list/list.component';
import { GroupListComponent } from './modules/group/list/list.component';
import { LoginFormComponent } from './modules/auth/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { PasswordResetFormComponent } from './modules/auth/password-reset/password-reset.component';
import { ForgotPasswordFormComponent } from './modules/auth/forgot-password/forgot-password.component';

const routes: Routes = [

  { path: 'auth', children: [
    { path: '', redirectTo: 'entrar', pathMatch: 'full' },
    { path: 'entrar', component: LoginFormComponent },
    { path: 'esqueci-senha', component: ForgotPasswordFormComponent },
    { path: 'redefinir-senha', component: PasswordResetFormComponent },
  ] },

  { path: '', canActivate: [AuthGuard], component: LayoutComponent, children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },

    { path: 'administracao', children: [
      { path: 'usuarios', component: UserListComponent },
      { path: 'grupos', component: GroupListComponent },
    ] }
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
