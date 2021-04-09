import { Injectable } from '@angular/core';

import { Page } from '../models/permission';

import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(
    private _storage: StorageService,
  ) { }

  check(page: Page, role: string): boolean {
    if (this._storage.getUser.type == 'administrator') return true;
    const permission = this._storage.getPermissions.find(perm => perm.page === page && perm.role === role);
    const group = this._storage.getGroups.find(
      group => group['_permissions'].find(perm => perm.page === page && perm.role === role));
    return permission != undefined || group != undefined;
  }
}
