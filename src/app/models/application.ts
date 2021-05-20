import { Base } from './base';
import { Student } from './student';
import { Question } from './assessment';

export class Application extends Base {
  init: Date;
  end?: Date;
  answers: Answer[];
  student: ApplicationStudent;

  mba?: MBA;
  course?: Course;
  assessment?: Assessment;

  _student?: Student;

  constructor() {
    super();
    this.answers = [];
    this.init = new Date();
    this.student = new ApplicationStudent();
  }
}

export class Answer {
  datetime: Date;
  question: Question;

  alternative?: string;
  neuro: {
    intensity: number;
    satisfaction: number;
  };

  constructor() {
    this.datetime = new Date();
  }

  get getResultNeuro() {
    if (this.neuro) {
      const intensity = this.neuro.intensity;
      const satisfaction = this.neuro.satisfaction;
      if (
        (satisfaction === 1 && intensity === 1) ||
        (satisfaction === 1 && intensity === 2) ||
        (satisfaction === 2 && intensity === 1) ||
        (satisfaction === 2 && intensity === 2)
      ) return 'NB';
      else if (
        (satisfaction === 1 && intensity === 3) ||
        (satisfaction === 1 && intensity === 4) ||
        (satisfaction === 2 && intensity === 3) ||
        (satisfaction === 2 && intensity === 4)
      ) return 'NA';
      else if (
        (satisfaction === 3 && intensity === 1) ||
        (satisfaction === 3 && intensity === 2) ||
        (satisfaction === 4 && intensity === 1) ||
        (satisfaction === 4 && intensity === 2)
      ) return 'PB';
      else if (
        (satisfaction === 3 && intensity === 3) ||
        (satisfaction === 3 && intensity === 4) ||
        (satisfaction === 4 && intensity === 3) ||
        (satisfaction === 4 && intensity === 4)
      ) return 'PA';
    }
  }
}

class ApplicationStudent {
  id: string;
  name: string;
}

class MBA {
  id: string;
  name: string;
}

class Course {
  id: string;
  name: string;
}

class Assessment {
  id: string;
  name: string;
}
