import { Base } from './base';

export class Assessment extends Base {
  name: string;
  duration: number;
  groups: string[];
  instructions: string[];
  type: 'neuro' | 'profile' | 'objective';

  _groups?: Group[];
  _questions?: Question[];
  _instructions?: Instruction[];

  constructor() {
    super();
    this.groups = [];
    this.instructions = [];
  }

  static get getTypes() {
    return [
      {id: 'neuro', name: 'Neuro'},
      {id: 'profile', name: 'Perfil'},
      {id: 'objective', name: 'Objetivo'}
    ];
  }

  get getTypeName() {
    return Question.getTypes.find(type => type.id === this.type).name;
  }
}

export class Instruction extends Base {
  title: string;
  text: string;

  constructor() {
    super();
  }
}

export class Group extends Base {
  name: string;
  image: string;
  questions: string[];

  _questions?: Question[];

  constructor() {
    super();
    this.questions = [];
  }
}

export class Question extends Base {
  title: string;
  text: string;
  point?: number;
  result?: string;
  alternatives?: Alternative[];
  type: 'neuro' | 'profile' | 'objective';

  constructor() {
    super();
  }

  static get getTypes() {
    return [
      {id: 'neuro', name: 'Neuro'},
      {id: 'profile', name: 'Perfil'},
      {id: 'objective', name: 'Objetivo'}
    ];
  }

  get getTypeName() {
    return Question.getTypes.find(type => type.id === this.type).name;
  }

  static get getNeuroResults() {
    return [
      {id: 'NB', name: 'NB'},
      {id: 'NA', name: 'NA'},
      {id: 'PB', name: 'PB'},
      {id: 'PA', name: 'PA'}
    ];
  }
}

export class Alternative {
  text: string;
  type?: string;
  isCorrect?: boolean;

  static get getProfileTypes() {
    return [
      {id: 'dog', name: 'Cachorro'},
      {id: 'lion', name: 'Leão'},
      {id: 'monkey', name: 'Macaco'},
      {id: 'peacock', name: 'Pavão'}
    ];
  }
}
