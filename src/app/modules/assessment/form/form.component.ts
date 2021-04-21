import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Assessment, Instruction, Question } from 'src/app/models/assessment';

import { UtilService } from 'src/app/services/util.service';
import { AssessmentService } from 'src/app/services/firebase/assessment/service';
import { AssessmentQuestionService } from 'src/app/services/firebase/assessment/question.service';
import { AssessmentInstructionService } from 'src/app/services/firebase/assessment/instruction.service';

@Component({
  selector: 'app-assessment-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class AssessmentFormComponent implements OnInit {

  saving = false;
  formGroup: FormGroup;
  questions: Question[];
  instructions: Instruction[];

  constructor(
    private _util: UtilService,
    private formBuilder: FormBuilder,
    private _assessment: AssessmentService,
    private _question: AssessmentQuestionService,
    private _instruction: AssessmentInstructionService,
    private dialogRef: MatDialogRef<AssessmentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Assessment = new Assessment(),
  ) {
    this.formGroup = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      duration: new FormControl('', Validators.required),
      questions: new FormControl([], Validators.required),
      instructions: new FormControl([], Validators.required),
      showTime: new FormControl(false)
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getQuestions();
    await this.getInstructions();
    if (this.data.id) this.setData();
  }

  setData(): void {
    this.formGroup.patchValue(this.data);
  }

  get controls() {
    return this.formGroup.controls;
  }

  async getQuestions() {
    this.questions = await this._question.getAllActive();
  }

  async getInstructions() {
    this.instructions = await this._instruction.getAllActive();
  }

  async onSubmit(): Promise<void> {
    if (this.formGroup.valid) {
      this.saving = true;
      Object.assign(this.data, this.formGroup.value);

      await this._assessment.save(this.data);

      this.saving = false;
      this._util.message('Questão salva com sucesso!', 'success');
      this.dialogRef.close(true);
    } else this._util.message('Verifique os dados antes de salvar!', 'warn');
  }
}
