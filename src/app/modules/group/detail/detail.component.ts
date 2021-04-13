import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Group } from 'src/app/models/group';

@Component({
  selector: 'app-group-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class GroupDetailComponent implements OnInit {

  @Inject(MAT_DIALOG_DATA) public object: Group;

  constructor(
    private dialogRef: MatDialogRef<GroupDetailComponent>,
  ) { }

  ngOnInit(): void { }

  goToBack(params?: any): void {
    this.dialogRef.close(params);
  }
}
