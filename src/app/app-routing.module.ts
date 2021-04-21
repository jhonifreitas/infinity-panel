import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Page, PageRole } from './models/permission';
import { AuthGuard } from './guards/auth.guard';
import { PermissionGuard } from './guards/permission.guard';

import { LayoutComponent } from './layout/layout.component';
import { UserListComponent } from './modules/user/list/list.component';
import { GroupListComponent } from './modules/group/list/list.component';
import { LoginFormComponent } from './modules/auth/login/login.component';
import { CouponListComponent } from './modules/coupon/list/list.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { StudentListComponent } from './modules/student/list/list.component';
import { StudentFormComponent } from './modules/student/form/form.component';
import { PasswordResetFormComponent } from './modules/auth/password-reset/password-reset.component';
import { AssessmentQuestionListComponent } from './modules/assessment/question/list/list.component';
import { ForgotPasswordFormComponent } from './modules/auth/forgot-password/forgot-password.component';
import { AssessmentInstructionListComponent } from './modules/assessment/instruction/list/list.component';
import { AssessmentListComponent } from './modules/assessment/list/list.component';

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

    {
      path: 'cupons',
      component: CouponListComponent,
      canActivate: [PermissionGuard],
      data: {permissions: [{page: Page.CounponPage, role: PageRole.CanList}]}
    },
    {
      path: 'alunos',
      canActivate: [PermissionGuard],
      data: {permissions: [{page: Page.StudentPage, role: PageRole.CanList}]},
      children: [
        { path: '', component: StudentListComponent },
        { path: 'formulario', children: [
          { path: '', component: StudentFormComponent },
          { path: ':id', component: StudentFormComponent },
        ] },
      ]
    },
    {
      path: 'assessments',
      canActivate: [PermissionGuard],
      component: AssessmentListComponent,
      data: {permissions: [{page: Page.AssessmentPage, role: PageRole.CanList}]},
    },
    {
      path: 'assessment', children: [
      { path: '', redirectTo: 'questoes', pathMatch: 'full' },
      {
        path: 'questoes',
        canActivate: [PermissionGuard],
        component: AssessmentQuestionListComponent,
        data: {permissions: [{page: Page.AssessmentQuestionPage, role: PageRole.CanList}]},
      },
      {
        path: 'instrucoes',
        canActivate: [PermissionGuard],
        component: AssessmentInstructionListComponent,
        data: {permissions: [{page: Page.AssessmentInstructionPage, role: PageRole.CanList}]},
      },
    ] },

    { path: 'administracao', children: [
      {
        path: 'usuarios',
        component: UserListComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [{page: Page.UserPage, role: PageRole.CanList}]},
      },
      {
        path: 'grupos',
        component: GroupListComponent,
        canActivate: [PermissionGuard],
        data: {permissions: [{page: Page.GroupPage, role: PageRole.CanList}]},
      },
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
