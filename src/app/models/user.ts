import { Base } from './base';

export class User extends Base {
  name: string;
  email: string;
  avatar?: string;
  groups: string[];
  permissions: string[];

  type: 'administrator' | 'common';

  constructor() {
    super();
    this.groups = [];
    this.type = 'common';
    this.permissions = [];
  }
}
