import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Group } from 'src/app/models/assessment';

@Component({
  selector: 'app-assessment-group-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class AssessmentGroupDetailComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public object: Group,
    private dialogRef: MatDialogRef<AssessmentGroupDetailComponent>
  ) { }

  ngOnInit(): void { }

  goToBack(params?: any): void {
    this.dialogRef.close(params);
  }
}
