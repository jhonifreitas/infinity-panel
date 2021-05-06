import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';

import { NgxDropzoneChangeEvent } from 'ngx-dropzone';

import { Access } from 'src/app/models/access';
import { FileUpload } from 'src/app/interfaces/base';
import { Company, Post } from 'src/app/models/company';

import { UtilService } from 'src/app/services/util.service';
import { AccessService } from 'src/app/services/firebase/access.service';
import { CompanyService } from 'src/app/services/firebase/company.service';

@Component({
  selector: 'app-company-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class CompanyFormComponent implements OnInit {

  saving = false;
  image: FileUpload;
  formGroup: FormGroup;
  accessList: Access[];

  constructor(
    private _util: UtilService,
    private _access: AccessService,
    private formBuilder: FormBuilder,
    private _company: CompanyService,
    private dialogRef: MatDialogRef<CompanyFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Company = new Company()
  ) {
    this.formGroup = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      accessId: new FormControl('', Validators.required),
      posts: this.formBuilder.array([], Validators.required),
      departments: this.formBuilder.array([], Validators.required),
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getAccess();
    if (this.data.id) this.setData();
  }

  setData(): void {
    this.formGroup.patchValue(this.data);
  }

  get controls() {
    return this.formGroup.controls;
  }

  get postControl() {
    return this.controls.posts as FormArray;
  }

  get departmentControl() {
    return this.controls.departments as FormArray;
  }

  get getFormPost() {
    return this.formBuilder.group({
      name: ['', Validators.required],
      level: [1, [Validators.required, Validators.min(1)]]
    });
  }

  async getAccess() {
    this.accessList = await this._access.getAllActive();
  }

  addPost(values?: Post) {
    const formGroup = this.getFormPost;
    if (values) formGroup.patchValue(values);
    this.postControl.push(formGroup);
  }

  removePost(index: number){
    this.postControl.removeAt(index);
  }

  addDepartment(value?: string) {
    const control = new FormControl(value, Validators.required);
    this.departmentControl.push(control);
  }

  removeDepartment(index: number){
    this.departmentControl.removeAt(index);
  }

  async takeImage(event: NgxDropzoneChangeEvent): Promise<void> {
    const loader = this._util.loading('Comprimindo imagem...');
    const image = await this._util.uploadImage(event.addedFiles[0]);
    const compress = await this._util.uploadCompress(image.path);
    this.image = {path: compress.base64, file: compress.file, new: true};
    loader.componentInstance.msg = 'Imagem comprimida!';
    loader.componentInstance.done();
  }

  async deleteImage(): Promise<void> {
    if (!this.image.new)
      this._util.delete().then(async _ => {
        await this._company.deleteImage(this.data.id);
        this.image = null;
      }).catch(_ => {});
    else this.image = null;
  }

  async onSubmit(): Promise<void> {
    if (this.formGroup.valid) {
      this.saving = true;
      Object.assign(this.data, this.formGroup.value);
      await this._company.save(this.data);

      this.saving = false;
      this._util.message('Empresa salva com sucesso!', 'success');
      this.dialogRef.close(true);
    } else this._util.message('Verifique os dados antes de salvar!', 'warn');
  }
}
