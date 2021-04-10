import { Base } from './base';
import { Permission } from './permission';

export class User extends Base {
  name: string;
  email: string;
  avatar?: string;
  groups: string[];
  permissions: Permission[];

  type: 'administrator' | 'common';

  constructor() {
    super();
    this.groups = [];
    this.type = 'common';
    this.permissions = [];
  }
}
