import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Student } from 'src/app/models/student';

@Component({
  selector: 'app-student-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class StudentDetailComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public object: Student,
    private dialogRef: MatDialogRef<StudentDetailComponent>,
  ) { }

  goToBack(params?: any): void {
    this.dialogRef.close(params);
  }
}
