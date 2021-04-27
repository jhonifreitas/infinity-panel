import { Base } from './base';
import { Assessment } from './assessment';

export class Access extends Base {
  code: string;

  mbas: string[];
  courses: string[];
  assessments: string[];

  _mbas?: any[];
  _courses?: any[];
  _assessments?: Assessment[];

  constructor() {
    super();
    this.mbas = [];
    this.courses = [];
    this.assessments = [];
  }
}
