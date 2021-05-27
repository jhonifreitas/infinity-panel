import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { FileUpload } from 'src/app/interfaces/base';
import { Department, Post } from 'src/app/models/company';

import { UtilService } from 'src/app/services/util.service';
import { CompanyService } from 'src/app/services/firebase/company/company.service';
import { CompanyPostService } from 'src/app/services/firebase/company/post.service';
import { CompanyBranchService } from 'src/app/services/firebase/company/branch.service';
import { CompanyDepartmentService } from 'src/app/services/firebase/company/department.service';

@Component({
  selector: 'app-company-post-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class CompanyPostFormComponent implements OnInit {

  saving = false;
  image: FileUpload;
  formGroup: FormGroup;
  departments: Department[];

  constructor(
    private _util: UtilService,
    private _company: CompanyService,
    private formBuilder: FormBuilder,
    private _post: CompanyPostService,
    private _branch: CompanyBranchService,
    private _department: CompanyDepartmentService,
    @Inject(MAT_DIALOG_DATA) public data: Post = new Post(),
    private dialogRef: MatDialogRef<CompanyPostFormComponent>
  ) {
    this.formGroup = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      level: new FormControl(1, [Validators.required, Validators.min(1)]),
      departmentId: new FormControl('', Validators.required),
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getCompanies();
    if (this.data.id) this.setData();
  }

  setData(): void {
    this.formGroup.patchValue(this.data);
  }

  get controls() {
    return this.formGroup.controls;
  }

  async getCompanies() {
    this.departments = await this._department.getAllActive();
    for (const deparmtent of this.departments) {
      const branch = await this._branch.getById(deparmtent.branchId);
      const company = await this._company.getById(branch.companyId);
      deparmtent.name = `${company.name} - ${branch.name} - ${deparmtent.name}`;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.formGroup.valid) {
      this.saving = true;
      Object.assign(this.data, this.formGroup.value);
      await this._post.save(this.data);

      this.saving = false;
      this._util.message('Cargo salvo com sucesso!', 'success');
      this.dialogRef.close(true);
    } else this._util.message('Verifique os dados antes de salvar!', 'warn');
  }
}
