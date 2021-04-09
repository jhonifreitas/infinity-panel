import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DashboardPage } from './dashboard.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule
  ],
  declarations: [DashboardPage],
})
export class DashboardModule {}
