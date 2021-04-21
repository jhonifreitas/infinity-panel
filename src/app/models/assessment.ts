import { Base } from './base';

export class Assessment extends Base {
  name: string;
  duration: number;
  showTime: boolean;
  questions: string[];
  instructions: string[];

  _questions?: Question[];
  _instructions?: Instruction[];

  constructor() {
    super();
    this.questions = [];
    this.showTime = false;
    this.instructions = [];
  }
}

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
