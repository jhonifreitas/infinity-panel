import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn } from '@angular/forms';

import { User } from 'src/app/models/user';
import { Group } from 'src/app/models/group';
import { Page, PageRole, Permission } from 'src/app/models/permission';

import { UtilService } from 'src/app/services/util.service';
import { UserService } from 'src/app/services/firebase/user.service';
import { GroupService } from 'src/app/services/firebase/group.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class UserFormComponent implements OnInit {

  @Inject(MAT_DIALOG_DATA) public data = new User();

  saving = false;
  groups: Group[];
  formGroup: FormGroup;
  permissions: Permission[];
  image: {path: string; new: boolean; file?: Blob};

  constructor(
    private _util: UtilService,
    private _user: UserService,
    private _group: GroupService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<UserFormComponent>,
  ) {
    this.formGroup = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      groups: new FormControl([]),
      permissions: new FormControl([]),
      password: new FormControl(''),
      confirmPass: new FormControl(''),
    }, {validators: !this.data ? this.validatorPassword : null});
  }

  ngOnInit(): void {
    this.getGroups();
    this.getPermissions();
    if (this.data) this.setData();
    else {
      this.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
      this.controls.confirmPass.setValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  get controls() {
    return this.formGroup.controls;
  }

  validatorPassword(group: FormGroup): ValidatorFn {
    const password = group.get('password').value;
    const confirmControl = group.get('confirmPass');
    let result: {
      required?: boolean;
      passNotSame?: boolean;
      minlength?: {actualLength: number; requiredLength: number};
    } = null;

    if (confirmControl.hasError('required')) result = {required: true};
    else if (confirmControl.hasError('minlength')) result = {minlength: confirmControl.errors.minlength};
    else if (password !== confirmControl.value) result = {passNotSame: true};

    confirmControl.setErrors(result);
    return null;
  }

  setData(): void {
    if (this.data.avatar) this.image = {path: this.data.avatar, new: false};
    this.controls.name.setValue(this.data.name);
    this.controls.email.setValue(this.data.email);
    this.controls.groups.setValue(this.data.groups);
    this.controls.permissions.setValue(this.data.permissions);
  }

  async getGroups(): Promise<void> {
    this.groups = await this._group.getAllActive();
  }

  getPermissions(): void {
    this.permissions = [];
    for (const page of Object.entries(Page))
      for (const role of Object.entries(PageRole))
        this.permissions.push({page: page[1], role: role[1]});
  }

  async takeImage(event: any): Promise<void> {
    const loader = this._util.loading('Comprimindo imagem...');
    const compress = await this._util.uploadCompress(event.addedFiles[0]);
    this.image = {path: compress.base64, file: compress.file, new: true};
    loader.componentInstance.msg = 'Imagem comprimida!';
    loader.componentInstance.done();
  }

  async saveImage(id: string): Promise<void> {
    if (this.image && this.image.new && this.image.file) await this._user.uploadImage(id, this.image.file);
  }

  async deleteImage(): Promise<void> {
    if (!this.image.new)
      this._util.delete().then(async _ => {
        await this._user.deleteImage(this.data.id);
        this.image = null;
      }).catch(_ => {});
    else this.image = null;
  }

  async save(): Promise<void> {
    if (this.formGroup.valid) {
      this.saving = true;
      const value = this.formGroup.value;
      delete value.confirmPass;
      Object.assign(this.data, value);

      await this._user.save(this.data).then(async id => {
        if (id) this.data.id = id;
        await this.saveImage(this.data.id);
      });

      this.saving = false;
      this._util.message('Usuário salvo com sucesso!', 'success');
      this.dialogRef.close(true);
    } else this._util.message('Verifique os dados antes de salvar!', 'warn');
  }
}
