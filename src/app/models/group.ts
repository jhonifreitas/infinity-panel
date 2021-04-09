import { Base } from './base';

export class Group extends Base {
  name: string;
  permissions: string[];

  constructor() {
    super();
    this.permissions = [];
  }
}
