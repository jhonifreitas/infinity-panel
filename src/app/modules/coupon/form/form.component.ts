import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Coupon } from 'src/app/models/coupon';
import { Assessment } from 'src/app/models/assessment';

import { UtilService } from 'src/app/services/util.service';
import { CouponService } from 'src/app/services/firebase/coupon.service';
import { AssessmentService } from 'src/app/services/firebase/assessment/service';

@Component({
  selector: 'app-coupon-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class CouponFormComponent implements OnInit {

  saving = false;
  formGroup: FormGroup;

  mbas: any[];
  courses: any[];
  assessments: Assessment[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Coupon = new Coupon(),
    private _util: UtilService,
    private _coupon: CouponService,
    private formBuilder: FormBuilder,
    private _assessment: AssessmentService,
    private dialogRef: MatDialogRef<CouponFormComponent>,
  ) {
    this.formGroup = this.formBuilder.group({
      code: new FormControl('', Validators.required),
      validity: new FormControl('', Validators.required),
      value: new FormControl('', [Validators.required, Validators.min(0)]),
      quantity: new FormControl(0, [Validators.required, Validators.min(0)]),
      mbas: new FormControl([]),
      courses: new FormControl([]),
      assessments: new FormControl([]),
      percentage: new FormControl(false)
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getAssessments();
    if (this.data.id) this.setData();
  }

  setData(): void {
    this.formGroup.patchValue(this.data);
  }

  get controls() {
    return this.formGroup.controls;
  }

  async getAssessments() {
    this.assessments = await this._assessment.getAllActive();
  }

  uppercase() {
    const value = this._util.removeAccent(this.controls.code.value);
    this.controls.code.setValue(value.toUpperCase());
  }

  async onSubmit(): Promise<void> {
    if (this.formGroup.valid) {
      this.saving = true;
      Object.assign(this.data, this.formGroup.value);
      await this._coupon.save(this.data);

      this.saving = false;
      this._util.message('Grupo salvo com sucesso!', 'success');
      this.dialogRef.close(true);
    } else this._util.message('Verifique os dados antes de salvar!', 'warn');
  }
}
