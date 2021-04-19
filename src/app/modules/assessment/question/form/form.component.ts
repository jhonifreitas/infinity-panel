import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';

import { Alternative, Question } from 'src/app/models/assessment';

import { UtilService } from 'src/app/services/util.service';
import { AssessmentQuestionService } from 'src/app/services/firebase/assessment/question.service';

@Component({
  selector: 'app-assessment-question-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class AssessmentQuestionFormComponent implements OnInit {

  saving = false;
  formGroup: FormGroup;
  types = this.data.getTypes;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Question = new Question(),
    private _util: UtilService,
    private formBuilder: FormBuilder,
    private _question: AssessmentQuestionService,
    private dialogRef: MatDialogRef<AssessmentQuestionFormComponent>,
  ) {
    this.formGroup = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      text: new FormControl('', Validators.required),
      type: new FormControl('neuro', Validators.required),
      alternatives: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    if (this.data) this.setData();
  }

  get controls() {
    return this.formGroup.controls;
  }

  get controlAlternatives() {
    return this.controls.alternatives as FormArray;
  }

  setData(): void {
    this.formGroup.patchValue(this.data);
  }

  getFormAlternative() {
    return this.formBuilder.group({
      text: ['', Validators.required],
      isCorrect: [false]
    })
  }

  addAlternative(values?: Alternative) {
    const formGroup = this.getFormAlternative();
    if (values) formGroup.patchValue(values);
    this.controlAlternatives.push(formGroup);
  }

  removeAlternative(index: number){
    this.controlAlternatives.removeAt(index);
  }

  async onSubmit(): Promise<void> {
    if (this.formGroup.valid) {
      this.saving = true;
      const value = this.formGroup.value;

      const tagImgs: HTMLImageElement[] = [].slice.call(document.getElementsByClassName('ql-editor')[0].getElementsByTagName('img'));
      for (let i = 0; i < tagImgs.length; i++) {
        const tag: HTMLImageElement = tagImgs[i];
        const src: string = tag.src;
        if (src.indexOf('base64') >= 0) {
          const file = await this._util.uploadCompress(src);
          const url = await this._question.uploadImage(i.toString(), file.file);
          value.text = value.text.replace(src, url);
        } else if (src.indexOf('firebasestorage.googleapis.com') >= 0 && this.data.text.indexOf(src) < 0) {
          await this._question.deleteImageByURL(src);
        }
      }

      Object.assign(this.data, value);

      await this._question.save(this.data);

      this.saving = false;
      this._util.message('Questão salva com sucesso!', 'success');
      this.dialogRef.close(true);
    } else this._util.message('Verifique os dados antes de salvar!', 'warn');
  }
}
