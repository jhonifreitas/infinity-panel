import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Coupon } from 'src/app/models/coupon';

import { UtilService } from 'src/app/services/util.service';
import { CouponService } from 'src/app/services/firebase/coupon.service';

@Component({
  selector: 'app-coupon-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class CouponFormComponent implements OnInit {

  saving = false;
  formGroup: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Coupon = new Coupon(),
    private _util: UtilService,
    private _coupon: CouponService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CouponFormComponent>,
  ) {
    this.formGroup = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      validityInit: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    if (this.data.id) this.setData();
  }

  get controls() {
    return this.formGroup.controls;
  }

  setData(): void {
    this.formGroup.patchValue(this.data);
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
