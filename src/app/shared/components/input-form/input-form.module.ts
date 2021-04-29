import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// MATERIAL
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// QUILL
import { QuillModule } from 'ngx-quill';
// MASK
import { NgxMaskModule } from 'ngx-mask';
// CURRENCY
import { NgxCurrencyModule } from 'ngx-currency';

import { InputFormComponent } from './input-form.component';

@NgModule({
  imports: [
    QuillModule,
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    NgxCurrencyModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    NgxMaskModule.forRoot(),
  ],
  declarations: [InputFormComponent],
  exports: [InputFormComponent]
})
export class InputFormModule { }
