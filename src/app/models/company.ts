import { Base } from './base';
import { Access } from './access';

export class Company extends Base {
  name: string;
  posts: Post[];
  image?: string;
  accessId: string;
  departments: string[];

  _access?: Access;

  constructor() {
    super();
    this.posts = [];
    this.departments = [];
  }
}

export class Post {
  name: string;
  level: number;
}
