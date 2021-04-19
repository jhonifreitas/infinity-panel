import { Base } from './base';

export class Instruction extends Base {
  title: string;
  text: string;

  constructor() {
    super();
  }
}

export class Question extends Base {
  title: string;
  text: string;
  type: 'dissertation' | 'objective' | 'neuro';
  alternatives?: Alternative[];

  constructor() {
    super();
  }

  get getTypes() {
    return [
      {id: 'neuro', name: 'Neuro'},
      {id: 'objective', name: 'Objetivo'},
      {id: 'dissertation', name: 'Dissertativo'},
    ]
  }
}

export class Alternative {
  text: string;
  isCorrect: boolean;

  constructor() {
    this.isCorrect = false;
  }
}
