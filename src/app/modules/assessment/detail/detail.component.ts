import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Assessment } from 'src/app/models/assessment';
import { AssessmentQuestionService } from 'src/app/services/firebase/assessment/question.service';
import { AssessmentInstructionService } from 'src/app/services/firebase/assessment/instruction.service';

@Component({
  selector: 'app-assessment-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class AssessmentDetailComponent implements OnInit {

  constructor(
    private _question: AssessmentQuestionService,
    private _instruction: AssessmentInstructionService,
    @Inject(MAT_DIALOG_DATA) public object: Assessment,
    private dialogRef: MatDialogRef<AssessmentDetailComponent>,
  ) { }

  async ngOnInit(): Promise<void> {
    for (const questionId of this.object.questions) {
      this.object._questions = [];
      const question = await this._question.getById(questionId);
      this.object._questions.push(question);
    }

    for (const instructionId of this.object.instructions) {
      this.object._instructions = [];
      const instruction = await this._instruction.getById(instructionId);
      this.object._instructions.push(instruction);
    }
  }

  goToBack(params?: any): void {
    this.dialogRef.close(params);
  }
}
