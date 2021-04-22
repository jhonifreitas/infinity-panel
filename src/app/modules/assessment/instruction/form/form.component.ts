import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Instruction } from 'src/app/models/assessment';

import { UtilService } from 'src/app/services/util.service';
import { AssessmentInstructionService } from 'src/app/services/firebase/assessment/instruction.service';

@Component({
  selector: 'app-assessment-instruction-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class AssessmentInstructionFormComponent implements OnInit {

  saving = false;
  formGroup: FormGroup;

  constructor(
    private _util: UtilService,
    private formBuilder: FormBuilder,
    private _instruction: AssessmentInstructionService,
    private dialogRef: MatDialogRef<AssessmentInstructionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Instruction = new Instruction()
  ) {
    this.formGroup = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      text: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    if (this.data.id) this.setData();
  }

  setData(): void {
    this.formGroup.patchValue(this.data);
  }

  get controls() {
    return this.formGroup.controls;
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
          const url = await this._instruction.uploadImage(i.toString(), file.file);
          value.text = value.text.replace(src, url);
        } else if (src.indexOf('firebasestorage.googleapis.com') >= 0 && this.data.text.indexOf(src) < 0)
          await this._instruction.deleteImageByURL(src);
      }

      Object.assign(this.data, value);

      await this._instruction.save(this.data);

      this.saving = false;
      this._util.message('Instrução salva com sucesso!', 'success');
      this.dialogRef.close(true);
    } else this._util.message('Verifique os dados antes de salvar!', 'warn');
  }
}
