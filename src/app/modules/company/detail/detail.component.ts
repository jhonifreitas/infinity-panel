import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Company } from 'src/app/models/company';
import { AccessService } from 'src/app/services/firebase/access.service';

@Component({
  selector: 'app-company-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {

  constructor(
    private _access: AccessService,
    @Inject(MAT_DIALOG_DATA) public object: Company,
    private dialogRef: MatDialogRef<CompanyDetailComponent>,
  ) { }

  async ngOnInit(): Promise<void> {
    if (this.object.accessId)
      this.object._access = await this._access.getById(this.object.accessId);
  }

  goToBack(params?: any): void {
    this.dialogRef.close(params);
  }
}
