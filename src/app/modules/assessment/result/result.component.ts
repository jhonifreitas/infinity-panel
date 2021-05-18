import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Company } from 'src/app/models/company';
import { Student } from 'src/app/models/student';
import { Application } from 'src/app/models/application';
import { Assessment, Question } from 'src/app/models/assessment';

import { UtilService } from 'src/app/services/util.service';
import { CompanyService } from 'src/app/services/firebase/company.service';
import { StudentService } from 'src/app/services/firebase/student.service';
import { ApplicationService } from 'src/app/services/firebase/application.service';
import { AssessmentService } from 'src/app/services/firebase/assessment/assessment.service';
import { AssessmentGroupService } from 'src/app/services/firebase/assessment/group.service';
import { AssessmentQuestionService } from 'src/app/services/firebase/assessment/question.service';

@Component({
  selector: 'app-assessment-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class AssessmentResultComponent implements OnInit {

  loading = true;
  formGroup: FormGroup;
  companies: Company[];
  result: {
    assessment: Assessment;
    applications: Application[];
  };
  assessments: Assessment[];

  constructor(
    private _util: UtilService,
    private formBuilder: FormBuilder,
    private _company: CompanyService,
    private _student: StudentService,
    private _group: AssessmentGroupService,
    private _assessment: AssessmentService,
    private _application: ApplicationService,
    private _question: AssessmentQuestionService,
  ) {
    this.formGroup = this.formBuilder.group({
      companyId: new FormControl(''),
      assessmentId: new FormControl('', Validators.required),
      dateRange: this.formBuilder.group({
        start: new FormControl('', Validators.required),
        end: new FormControl('', Validators.required)
      })
    })
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    await this.getAssessments();
    await this.getCompanies();
    this.loading = false;
  }

  get controls() {
    return this.formGroup.controls;
  }

  async getAssessments() {
    this.assessments = await this._assessment.getAllActive();
  }

  async getCompanies() {
    this.companies = await this._company.getAllActive();
  }

  getResultByStudent(application: Application, question: Question) {
    const answer = application.answers.find(answer => answer.question.id === question.id);
    return answer.getResultNeuro;
  }

  async onSubmit() {
    if (this.formGroup.valid) {
      this.loading = true;
      const value = this.formGroup.value;

      // ASSESSMENT
      const assessment = this.assessments.find(assessment => assessment.id === value.assessmentId);
      assessment._groups = [];
      for (const groupId of assessment.groups) {
        const group = await this._group.getById(groupId);
        group._questions = [];
        for (const questionId of group.questions)
          group._questions.push(await this._question.getById(questionId));
        assessment._groups.push(group);
      }

      // APPLICATION
      const applications = await this._application.getByAssementIdByRangeDate(assessment.id, value.dateRange);
      for (const application of applications) {
        application._student = Object.assign(new Student(), await this._student.getById(application.student.id));
      }

      if (!applications.length) this._util.message('Nenhuma aplicação encontrada!', 'warn');
      else this.result = {assessment, applications};

      this.loading = false;
    } else this._util.message('Verifique os dados antes de buscar!', 'warn');
  }
}
