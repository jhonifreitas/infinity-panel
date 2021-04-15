import { Base } from './base';

export class Student extends Base {
  name: string;
  email: string;
  avatar?: string;

  constructor() {
    super();
  }
}
