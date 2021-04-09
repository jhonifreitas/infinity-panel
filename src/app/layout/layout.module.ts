import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// MATERIAL
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatListModule } from '@angular/material/list';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';

// ===============================================================================
// MODULES =======================================================================
// ===============================================================================
import { DeleteComponent } from 'src/app/shared/components/delete/delete.component';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';

// MASK
import { NgxMaskModule } from 'ngx-mask';
// DROPZONE
import { NgxDropzoneModule } from 'ngx-dropzone';
// CKEDITOR
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// COMPRESS
import { NgxImageCompressService } from 'ngx-image-compress';
// SELECT FILTER
// import { MatSelectFilterModule } from 'mat-select-filter';
// LOTTIE
import { LottieModule } from 'ngx-lottie';
export function playerFactory(): Promise<any> {return import('lottie-web')}

// DEFAULT
import { DefaultComponent } from './layout.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { translateMatPaginator } from 'src/app/services/localization.service';

@NgModule({
  declarations: [
    DeleteComponent,
    LoadingComponent,
    DefaultComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    SharedModule,
    MatCardModule,
    MatIconModule,
    MatSortModule,
    MatListModule,
    MatTableModule,
    DragDropModule,
    MatInputModule,
    CKEditorModule,
    MatChipsModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatRippleModule,
    MatToolbarModule,
    MatSidenavModule,
    MatDividerModule,
    FlexLayoutModule,
    NgxDropzoneModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    // MatSelectFilterModule,
    MatAutocompleteModule,
    NgxMaskModule.forRoot(),
    MatProgressSpinnerModule,
    LottieModule.forRoot({player: playerFactory, useCache: true})
  ],
  providers: [
    NgxImageCompressService,
    { provide: MatPaginatorIntl, useValue: translateMatPaginator() }
  ]
})
export class LayoutModule { }
