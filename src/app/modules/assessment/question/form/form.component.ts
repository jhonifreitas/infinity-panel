import { Component, OnInit, Inject } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
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
  types = Question.getTypes;
  neuroResults = Question.getNeuroResults;
  profileTypes = Alternative.getProfileTypes;

  constructor(
    private _util: UtilService,
    private formBuilder: FormBuilder,
    private _question: AssessmentQuestionService,
    @Inject(MAT_DIALOG_DATA) public data: Question = new Question(),
    private dialogRef: MatDialogRef<AssessmentQuestionFormComponent>
  ) {
    this.formGroup = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      text: new FormControl('', Validators.required),
      point: new FormControl(''),
      result: new FormControl('', Validators.required),
      type: new FormControl('neuro', Validators.required),
      alternatives: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    if (this.data.id) this.setData();
  }

  setData(): void {
    this.formGroup.patchValue(this.data);
    if (this.data.type !== 'neuro') {
      this.controls.result.clearValidators();
      this.controls.result.updateValueAndValidity();
    }
    if (this.data.type === 'objective') {
      this.controls.point.setValidators([Validators.required, Validators.min(1)]);
      this.controls.point.updateValueAndValidity();
    }
    for (const alternative of this.data.alternatives) this.addAlternative(alternative);
  }

  get controls() {
    return this.formGroup.controls;
  }

  get controlAlternatives() {
    return this.controls.alternatives as FormArray;
  }

  getFormAlternative(type: 'profile' | 'objective') {
    if (type === 'objective')
      return this.formBuilder.group({
        text: ['', Validators.required],
        isCorrect: [false]
      });
    else
      return this.formBuilder.group({
        text: ['', Validators.required],
        type: ['', Validators.required]
      });
  }

  addAlternative(values?: Alternative) {
    const formGroup = this.getFormAlternative(this.controls.type.value);
    if (values) formGroup.patchValue(values);
    this.controlAlternatives.push(formGroup);
  }

  removeAlternative(index: number){
    this.controlAlternatives.removeAt(index);
  }

  changeType(event: MatSelectChange) {
    this.controls.point.clearValidators();
    this.controls.result.clearValidators();
    this.controlAlternatives.clearValidators();

    if (event.value === 'objective')
      this.controls.point.setValidators([Validators.required, Validators.min(1)]);
    if (event.value === 'neuro') this.controls.result.setValidators(Validators.required);
    else this.controlAlternatives.setValidators(Validators.required);

    this.controls.point.updateValueAndValidity();
    this.controls.result.updateValueAndValidity();
    this.controlAlternatives.updateValueAndValidity();
  }

  async uploadImages() {
    const tagImgs: HTMLImageElement[] = [].slice.call(document.getElementsByClassName('ql-editor')[0].getElementsByTagName('img'));
      for (let i = 0; i < tagImgs.length; i++) {
        const tag: HTMLImageElement = tagImgs[i];
        const src: string = tag.src;
        if (src.indexOf('base64') >= 0) {
          const file = await this._util.uploadCompress(src);
          const url = await this._question.uploadImage(i.toString(), file.file);
          await this._question.update(this.data.id, {text: this.data.text.replace(src, url)});
        } else if (src.indexOf('firebasestorage.googleapis.com') >= 0 && this.data.text.indexOf(src) < 0)
          await this._question.deleteImageByURL(src);
      }
  }

  async onSubmit(): Promise<void> {
    if (this.formGroup.valid) {
      this.saving = true;
      const value = this.formGroup.value;

      Object.assign(this.data, value);

      await this._question.save(this.data).then(async id => {
        if (id) this.data.id;
        await this.uploadImages();
      });

      this.saving = false;
      this._util.message('Questão salva com sucesso!', 'success');
      this.dialogRef.close(true);
    } else this._util.message('Verifique os dados antes de salvar!', 'warn');
  }
}
