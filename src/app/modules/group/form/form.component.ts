import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Group } from 'src/app/models/group';
import { Permission } from 'src/app/models/permission';

import { UtilService } from 'src/app/services/util.service';
import { GroupService } from 'src/app/services/firebase/group.service';

@Component({
  selector: 'app-group-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class GroupFormComponent implements OnInit {

  @Inject(MAT_DIALOG_DATA) public data = new Group();

  saving = false;
  formGroup: FormGroup;
  permissions: {id: string; name: string}[];

  constructor(
    private _util: UtilService,
    private _group: GroupService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<GroupFormComponent>,
  ) {
    this.formGroup = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      permissions: new FormControl([], Validators.required),
    });
  }

  ngOnInit(): void {
    this.getPermissions();
    if (this.data) this.setData();
  }

  get controls() {
    return this.formGroup.controls;
  }

  getPermissions() {
    this.permissions = [];
    let id = 0;
    for (const page of new Permission().getPages)
      for (const role of new Permission().getPageRoles) {
        this.permissions.push({id: id.toString(), name: `${page.name} - ${role.name}`});
        id += 1;
      }
  }

  setData(): void {
    this.controls.name.setValue(this.data.name);
    this.controls.permissions.setValue(this.data.permissions);
  }

  async onSubmit(): Promise<void> {
    if (this.formGroup.valid) {
      this.saving = true;
      Object.assign(this.data, this.formGroup.value);
      await this._group.save(this.data);

      this.saving = false;
      this._util.message('Groupo salvo com sucesso!', 'success');
      this.dialogRef.close(true);
    } else this._util.message('Verifique os dados antes de salvar!', 'warn');
  }
}
