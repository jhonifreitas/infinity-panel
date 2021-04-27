import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Access } from 'src/app/models/access';
import { AssessmentService } from 'src/app/services/firebase/assessment/assessment.service';

@Component({
  selector: 'app-access-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class AccessDetailComponent implements OnInit {

  constructor(
    private _assessment: AssessmentService,
    @Inject(MAT_DIALOG_DATA) public object: Access,
    private dialogRef: MatDialogRef<AccessDetailComponent>,
  ) { }

  async ngOnInit(): Promise<void> {
    if (this.object.assessments)
      for (const assessmentId of this.object.assessments) {
        this.object._assessments = [];
        const assessment = await this._assessment.getById(assessmentId);
        this.object._assessments.push(assessment);
      }
  }

  goToBack(params?: any): void {
    this.dialogRef.close(params);
  }
}
