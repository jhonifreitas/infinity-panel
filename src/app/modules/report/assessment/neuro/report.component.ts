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
import { CompanyService } from 'src/app/services/firebase/company/company.service';
import { CompanyPostService } from 'src/app/services/firebase/company/post.service';
import { SubscriptionService } from 'src/app/services/firebase/subscription.service';
import { CompanyBranchService } from 'src/app/services/firebase/company/branch.service';
import { AssessmentService } from 'src/app/services/firebase/assessment/assessment.service';
import { AssessmentGroupService } from 'src/app/services/firebase/assessment/group.service';
import { CompanyDepartmentService } from 'src/app/services/firebase/company/department.service';
import { AssessmentQuestionService } from 'src/app/services/firebase/assessment/question.service';

@Component({
  selector: 'app-report-assessment',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportAssessmentComponent implements OnInit {

  loading = true;
  formGroup: FormGroup;
  result: {
    assessment: Assessment;
    applications: Application[];
  };
  accessList: Access[];
  assessments: Assessment[];

  constructor(
    private _util: UtilService,
    private _access: AccessService,
    private formBuilder: FormBuilder,
    private _company: CompanyService,
    private _student: StudentService,
    private _post: CompanyPostService,
    private _branch: CompanyBranchService,
    private _group: AssessmentGroupService,
    private _assessment: AssessmentService,
    private _application: ApplicationService,
    private _subscription: SubscriptionService,
    private _question: AssessmentQuestionService,
    private _department: CompanyDepartmentService,
  ) {
    this.formGroup = this.formBuilder.group({
      assessmentId: new FormControl('', Validators.required),
      accessId: new FormControl('', Validators.required),
    });
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    await this.getAccess();
    await this.getAssessments();
    this.loading = false;
  }

  get controls() {
    return this.formGroup.controls;
  }

  async getAssessments() {
    this.assessments = await this._assessment.getWhere('type', '==', 'neuro');
  }

  async getAccess() {
    this.accessList = await this._access.getAll();
  }

  getResultByStudent(application: Application, question: Question) {
    return application.answers.find(answ => answ.question.id === question.id)?.getResultNeuro;
  }

  getPercentConvergeDiverge(group: Group, application: Application) {
    const questions = group.questions;

    const converge = application.answers.filter(
      answer => questions.find(question => question === answer.question.id) && answer.resultIsConverge
    );
    const diverge = application.answers.filter(
      answer => questions.find(question => question === answer.question.id) && answer.resultIsDiverge
    );

    const imc = application.answers.filter(
      answer => questions.find(question => question === answer.question.id) && answer.resultIsIMC
    );
    const imd = application.answers.filter(
      answer => questions.find(question => question === answer.question.id) && answer.resultIsIMD
    );

    return {
      imc: imc.length / questions.length * 100,
      imd: imd.length / questions.length * 100,
      converge: converge.length / questions.length * 100,
      diverge: diverge.length / questions.length * 100
    };
  }

  async onSubmit() {
    if (this.formGroup.valid) {
      this.loading = true;
      const value = this.formGroup.value;

      // ASSESSMENT
      const assessment = this.assessments.find(assess => assess.id === value.assessmentId);
      assessment._groups = [];
      for (const groupId of assessment.groups) {
        const group = await this._group.getById(groupId);
        group._questions = [];
        for (const questionId of group.questions)
          group._questions.push(await this._question.getById(questionId));
        assessment._groups.push(group);
      }

      // APPLICATION
      let applications = await this._application.getByAssementId(assessment.id);
      applications = applications.filter(async application => {
        return await this._subscription.getByAccessIdByStudentIdByAssessmentId(
          value.accessId,
          application.student.id,
          value.assessmentId
        ).catch(_ => {});
      });
      for (const application of applications) {
        application.answers = application.answers.map(answer => Object.assign(new Answer(), answer));
        application._student = Object.assign(new Student(), await this._student.getById(application.student.id));
        if (application._student.company.companyId)
          application._student.company._company = await this._company.getById(application._student.company.companyId);
        if (application._student.company.branchId)
          application._student.company._branch = await this._branch.getById(application._student.company.branchId);
        if (application._student.company.departmentId)
          application._student.company._department = await this._department.getById(application._student.company.departmentId);
        if (application._student.company.postId)
          application._student.company._post = await this._post.getById(application._student.company.postId);
      }

      if (!applications.length) this._util.message('Nenhuma aplicação encontrada!', 'warn');
      else this.result = {assessment, applications};

      this.loading = false;
    } else this._util.message('Verifique os dados antes de buscar!', 'warn');
  }
}
