import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

import { LayoutComponent } from './layout/layout.component';
import { UserListComponent } from './modules/user/list/list.component';
import { GroupListComponent } from './modules/group/list/list.component';
import { LoginFormComponent } from './modules/auth/login/login.component';
import { CouponListComponent } from './modules/coupon/list/list.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { StudentListComponent } from './modules/student/list/list.component';
import { PasswordResetFormComponent } from './modules/auth/password-reset/password-reset.component';
import { AssessmentQuestionListComponent } from './modules/assessment/question/list/list.component';
import { ForgotPasswordFormComponent } from './modules/auth/forgot-password/forgot-password.component';
import { AssessmentInstructionListComponent } from './modules/assessment/instruction/list/list.component';

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

    { path: 'cupons', component: CouponListComponent },
    { path: 'alunos', component: StudentListComponent },
    { path: 'assessment', children: [
      { path: '', redirectTo: 'questoes', pathMatch: 'full' },
      { path: 'questoes', component: AssessmentQuestionListComponent },
      { path: 'instrucoes', component: AssessmentInstructionListComponent },
    ] },

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
