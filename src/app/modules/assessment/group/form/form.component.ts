import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Group } from 'src/app/models/assessment';
import { FileUpload } from 'src/app/interfaces/base';

import { UtilService } from 'src/app/services/util.service';
import { AssessmentGroupService } from 'src/app/services/firebase/assessment/group.service';

@Component({
  selector: 'app-assessment-group-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class AssessmentGroupFormComponent implements OnInit {

  saving = false;
  image: FileUpload;
  formGroup: FormGroup;

  constructor(
    private _util: UtilService,
    private formBuilder: FormBuilder,
    private _group: AssessmentGroupService,
    @Inject(MAT_DIALOG_DATA) public data: Group = new Group(),
    private dialogRef: MatDialogRef<AssessmentGroupFormComponent>
  ) {
    this.formGroup = this.formBuilder.group({
      name: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    if (this.data.id) this.setData();
  }

  setData(): void {
    if (this.data.image) this.image = {path: this.data.image, new: false};
    this.formGroup.patchValue(this.data);
  }

  get controls() {
    return this.formGroup.controls;
  }

  async takeImage(event: any): Promise<void> {
    const loader = this._util.loading('Comprimindo imagem...');
    const compress = await this._util.uploadCompress(event.addedFiles[0]);
    this.image = {path: compress.base64, file: compress.file, new: true};
    loader.componentInstance.msg = 'Imagem comprimida!';
    loader.componentInstance.done();
  }

  async deleteImage(): Promise<void> {
    if (!this.image.new)
      this._util.delete().then(async _ => {
        await this._group.deleteImage(this.data.id);
        this.image = null;
      }).catch(_ => {});
    else this.image = null;
  }

  async onSubmit(): Promise<void> {
    if (this.formGroup.valid) {
      this.saving = true;
      Object.assign(this.data, this.formGroup.value);

      await this._group.save(this.data).then(async id => {
        if (id) this.data.id = id;
        if (this.image && this.image.new && this.image.file) {
          const url = await this._group.uploadImage(this.data.id, this.image.file);
          await this._group.update(this.data.id, {image: url});
        }
      });

      this.saving = false;
      this._util.message('Grupo salvo com sucesso!', 'success');
      this.dialogRef.close(true);
    } else this._util.message('Verifique os dados antes de salvar!', 'warn');
  }
}
