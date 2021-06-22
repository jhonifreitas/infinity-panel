import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Access } from 'src/app/models/access';
import { Student } from 'src/app/models/student';
import { Answer, Application } from 'src/app/models/application';
import { Assessment, Group, Question } from 'src/app/models/assessment';

import { UtilService } from 'src/app/services/util.service';
import { AccessService } from 'src/app/services/firebase/access.service';
import { StudentService } from 'src/app/services/firebase/student.service';
import { ApplicationService } from 'src/app/services/firebase/application.service';
import { AssessmentService } from 'src/app/services/firebase/assessment/assessment.service';
import { AssessmentGroupService } from 'src/app/services/firebase/assessment/group.service';
import { AssessmentQuestionService } from 'src/app/services/firebase/assessment/question.service';

@Component({
  selector: 'app-report-assessment-profile',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportAssessmentStudentProfileComponent implements OnInit {

  loading = true;
  formGroup: FormGroup;
  result: {
    groups: Group[];
    student: Student;
  };
  students: Student[];
  accessList: Access[];
  assessments: Assessment[];

  constructor(
    private _util: UtilService,
    private _access: AccessService,
    private formBuilder: FormBuilder,
    private _student: StudentService,
    private _group: AssessmentGroupService,
    private _assessment: AssessmentService,
    private _application: ApplicationService,
    private _question: AssessmentQuestionService,
  ) {
    this.formGroup = this.formBuilder.group({
      assessmentId: new FormControl('', Validators.required),
      studentId: new FormControl('', Validators.required),
      accessId: new FormControl('', Validators.required),
    });
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    await this.getAccess();
    await this.getStudents();
    await this.getAssessments();
    this.loading = false;
  }

  get controls() {
    return this.formGroup.controls;
  }

  async getAssessments() {
    this.assessments = await this._assessment.getWhere('type', '==', 'profile');
  }

  async getAccess() {
    this.accessList = await this._access.getAll('code');
  }

  async getStudents() {
    this.students = await this._student.getAll('name');
  }

  getResultByStudent(application: Application, question: Question) {
    return application.answers.find(answ => answ.question.id === question.id)?.getResultNeuro;
  }

  getProfile(answers: Answer[]) {
    let dog = 0;
    let lion = 0;
    let monkey = 0;
    let peacock = 0;
    const total = answers.length;

    for (const answer of answers)
      if (answer.alternative === 'dog') dog += 1;
      else if (answer.alternative === 'lion') lion += 1;
      else if (answer.alternative === 'monkey') monkey += 1;
      else if (answer.alternative === 'peacock') peacock += 1;

    return [
      { type: 'dog', value: ((dog / total) * 100 || 0) },
      { type: 'lion', value: ((lion / total) * 100 || 0) },
      { type: 'monkey', value: ((monkey / total) * 100 || 0) },
      { type: 'peacock', value: ((peacock / total) * 100 || 0) }
    ];
  }

  async onSubmit() {
    if (this.formGroup.valid) {
      this.loading = true;
      const value = this.formGroup.value;

      // STUDENT
      const student = this.students.find(stud => stud.id === value.studentId);

      // ASSESSMENT
      const assessment = this.assessments.find(assess => assess.id === value.assessmentId);

      // APPLICATION
      const groups = [];
      const applications = await this._application.getByAssementIdByStudentIdByAccessId(assessment.id, student.id, value.accessId);
      const application = applications[0];
      if (application) {
        application.answers = application.answers.map(answer => Object.assign(new Answer(), answer));
        const profiles = this.getProfile(application.answers);
        student['profiles'] = profiles.sort((a, b) => b.value - a.value);

        // GROUP
        for (const groupId of assessment.groups) {
          const group = await this._group.getById(groupId);
          const answers = application.answers.filter(answ => group.questions.includes(answ.question.id));

          group['result'] = this.getProfile(answers);
          groups.push(group);
        }
      } else this._util.message('Nenhuma aplicação encontrada!', 'warn');

      this.result = {groups, student};

      this.loading = false;
    } else this._util.message('Verifique os dados antes de buscar!', 'warn');
  }
}
