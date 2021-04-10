import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule
  ],
  declarations: [DashboardComponent],
})
export class DashboardModule {}
