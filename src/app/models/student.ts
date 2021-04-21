import { Base } from './base';

export class Student extends Base {
  name: string;
  email: string;
  image?: string;

  constructor() {
    super();
  }
}
