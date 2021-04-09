import { Injectable } from '@angular/core';

import { User } from 'src/app/models/user';
import { Group } from 'src/app/models/group';
import { Permission } from 'src/app/models/permission';
import { GroupService } from './firebase/group.service';
import { PermissionService } from './firebase/permission.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private _group: GroupService,
    private _permission: PermissionService,
  ) { }

  // USER
  async setUser(data: User): Promise<void> {
    const groups = [];
    const permissions = [];

    if (data.permissions) {
      for (const permission_id of data.permissions) {
        await this._permission.getById(permission_id).then(permission => {
          permissions.push(permission);
        });
      }
      this.setPermissions = permissions;
    }
    if (data.groups) {
      for (const group_id of data.groups) {
        await this._group.getById(group_id).then(async group => {
          for (const permission_id of group.permissions) {
            await this._permission.getById(permission_id).then(permission => {
              group['_permissions'].push(permission);
            });
          }
          groups.push(group);
        });
      }
      this.setGroups = groups;
    }
    localStorage.setItem('user', JSON.stringify(data));
  }
  get getUser(): User {
    return JSON.parse(localStorage.getItem('user'));
  }
  removeUser(): void {
    localStorage.removeItem('user');
  }

  // GROUP
  set setGroups(data: Group[]) {
    localStorage.setItem('groups', JSON.stringify(data));
  }
  get getGroups(): Group[] {
    return JSON.parse(localStorage.getItem('groups')) || [];
  }
  removeGroups(): void {
    localStorage.removeItem('groups');
  }

  // PERMISSIONS
  set setPermissions(data: Permission[]) {
    localStorage.setItem('permissions', JSON.stringify(data));
  }
  get getPermissions(): Permission[] {
    return JSON.parse(localStorage.getItem('permissions')) || [];
  }
  removePermissions(): void {
    localStorage.removeItem('permissions');
  }
}
