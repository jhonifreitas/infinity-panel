import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { User } from 'src/app/models/user';

import { GroupService } from 'src/app/services/firebase/group.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  @Inject(MAT_DIALOG_DATA) public object: User;

  constructor(
    private _group: GroupService,
    private dialogRef: MatDialogRef<UserDetailComponent>,
  ) { }

  async ngOnInit(): Promise<void> {
    for (const groupId of this.object.groups) {
      this.object.groups = [];
      const group = await this._group.getById(groupId);
      this.object._groups.push(group);
    }
  }

  goToBack(params?: any): void {
    this.dialogRef.close(params);
  }
}