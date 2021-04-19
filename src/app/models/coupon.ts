import { Base } from './base';

export class Coupon extends Base {
  name: string;
  validityInit: Date;
  validityEnd: Date;

  constructor() {
    super();
  }
}
