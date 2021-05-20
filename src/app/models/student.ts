import { Base } from './base';
import { differenceInYears } from 'date-fns';

export class Student extends Base {
  name: string;
  email: string;
  authType: 'email' | 'google' | 'facebook' | 'apple';

  token?: string;
  image?: string;
  phone?: string;
  genre?: string;
  dateBirth?: Date;
  placeBirth?: string;
  civilStatus?: string;

  rg?: string;
  cpf?: string;
  rgEmitter?: string;

  motherName?: string;
  spouseName?: string;

  social?: Social;
  course?: Course;
  address?: Address;
  company?: Company;

  constructor() {
    super();
    this.authType = 'email';
  }

  get getAge() {
    return differenceInYears(new Date(), this.dateBirth) || 0;
  }

  get getGeneration() {
    const year = this.dateBirth.getFullYear();
    if (year >= 1943 && year <= 1960) return 'BB';
    else if (year >= 1961 && year <= 1981) return 'GX';
    else if (year >= 1982 && year <= 2004) return 'GY';
    else if (year >= 2005 && year <= 2022) return 'GZ';
  }

  get getSeven() {
    const age = this.getAge;
    let seven = 1;
    for (let i = 0; i <= 120; i += 7) {
      if (i <= age) seven += 1;
      else if (i > age) break;
    }
    return seven;
  }
}

export class Social {
  linkedin?: string;
  facebook?: string;
  instagram?: string;
}

export class Course {
  name: string;
  institute: string;
  city: string;
  state: string;
  conclusion?: Date;
}

export class Address {
  street: string;
  district: string;
  number: string;
  city: string;
  state: string;
  zipcode: string;
  complement?: string;
}

export class Company {
  name: string;
  post: string;
}
