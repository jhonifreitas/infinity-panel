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
  selector: 'app-report-assessment-neuro',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportAssessmentNeuroComponent implements OnInit {

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

  getPercent(group: Group, application: Application) {
    const questions = group.questions;

    const converge = application.answers.filter(
      answer => questions.find(question => question === answer.question.id) && answer.resultIsConverge
    );
    const diverge = application.answers.filter(
      answer => questions.find(question => question === answer.question.id) && !answer.resultIsConverge
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

  getAllConvergeDiverge(application: Application, assessment: Assessment) {
    const converge = application.answers.filter(answer => answer.resultIsConverge);
    const diverge = application.answers.filter(answer => !answer.resultIsConverge);
    return {
      converge: converge.length / assessment._questions.length * 100,
      diverge: diverge.length / assessment._questions.length * 100
    };
  }

  getAllConvergeDivergeLeader(application: Application, leader: Application, assessment: Assessment) {
    const converge = application.answers.filter(answer => {
      const leaderAnswer = leader.answers.find(answ => answ.question.id === answer.question.id);
      return leaderAnswer && Answer.isConverge(leaderAnswer.getResultNeuro, answer.getResultNeuro);
    });
    const diverge = application.answers.filter(answer => {
      const leaderAnswer = leader.answers.find(answ => answ.question.id === answer.question.id);
      return leaderAnswer && !Answer.isConverge(leaderAnswer.getResultNeuro, answer.getResultNeuro);
    });
    return {
      converge: converge.length / assessment._questions.length * 100,
      diverge: diverge.length / assessment._questions.length * 100
    };
  }

  async getProfile(studentId: string, accessId: string) {
    const subscription = await this._subscription.getByAccessIdByStudentId(accessId, studentId).catch(_ => {});
    if (!subscription) return null;
    let assessment: Assessment = null;
    for (const assessmentId of subscription.assessmentIds) {
      const assess = await this._assessment.getById(assessmentId);
      if (assess.type === 'profile') assessment = assess;
    }
    if (!assessment) return null;
    const application = (await this._application.getByAssementIdByStudentIdByAccessId(assessment.id, studentId, accessId))[0];
    if (!application) return null;

    let dog = 0;
    let lion = 0;
    let monkey = 0;
    let peacock = 0;
    const total = application.answers.length;

    for (const answer of application.answers)
      if (answer.alternative === 'dog') dog += 1;
      else if (answer.alternative === 'lion') lion += 1;
      else if (answer.alternative === 'monkey') monkey += 1;
      else if (answer.alternative === 'peacock') peacock += 1;

    const result = [
      { type: 'dog', value: (dog / total) * 100 },
      { type: 'lion', value: (lion / total) * 100 },
      { type: 'monkey', value: (monkey / total) * 100 },
      { type: 'peacock', value: (peacock / total) * 100 }
    ];
    return result.sort((a, b) => b.value - a.value);
  }

  async onSubmit() {
    if (this.formGroup.valid) {
      this.loading = true;
      this.result = null;
      const value = this.formGroup.value;

      // ASSESSMENT
      const assessment = this.assessments.find(assess => assess.id === value.assessmentId);
      assessment._groups = [];
      assessment._questions = [];
      for (const groupId of assessment.groups) {
        const group = await this._group.getById(groupId);
        group._questions = [];
        for (const questionId of group.questions) {
          const question = await this._question.getById(questionId);
          group._questions.push(question);
          assessment._questions.push(question);
        }
        assessment._groups.push(group);
      }

      // APPLICATION
      let applications = await this._application.getByAssementIdByAccessId(assessment.id, value.accessId);
      for (const application of applications) {
        application.answers = application.answers.map(answer => Object.assign(new Answer(), answer));
        application._student = Object.assign(new Student(), await this._student.getById(application.student.id));
        application._student['profiles'] = await this.getProfile(application.student.id, value.accessId);

        const convergeDiverge = this.getAllConvergeDiverge(application, assessment);
        application._student['converge'] = convergeDiverge.converge;
        application._student['diverge'] = convergeDiverge.diverge;

        if (application._student.company.companyId)
          application._student.company._company = await this._company.getById(application._student.company.companyId);
        if (application._student.company.branchId)
          application._student.company._branch = await this._branch.getById(application._student.company.branchId);
        if (application._student.company.departmentId)
          application._student.company._department = await this._department.getById(application._student.company.departmentId);
        if (application._student.company.postId)
          application._student.company._post = await this._post.getById(application._student.company.postId);

        const leader = applications.find(x => x._student.company._post.level === application._student.company._post.level + 1);
        if (leader) {
          const convergeDivergeLeader = this.getAllConvergeDivergeLeader(application, leader, assessment);
          application._student['leaderConverge'] = convergeDivergeLeader.converge;
          application._student['leaderDiverge'] = convergeDivergeLeader.diverge;
        }
      }

      // RANKING
      const rankingConverge = applications.sort((a, b) => b['converge'] - a['converge']);
      const rankingDiverge = applications.sort((a, b) => b['diverge'] - a['diverge']);
      applications = applications.map(app => {
        const rankConverge = rankingConverge.findIndex(x => x.student.id === app.student.id) + 1;
        const rankDiverge = rankingDiverge.findIndex(x => x.student.id === app.student.id) + 1;
        app._student['rankConverge'] = `${rankConverge}º`;
        app._student['rankDiverge'] = `${rankDiverge}º`;
        return app;
      });

      // TEAM RANKING
      for (const application of applications) {
        const teams = applications.filter(app => app._student.company.areaId === application._student.company.areaId);
        const rankingTeamConverge = teams.sort((a, b) => b['converge'] - a['converge']);
        const rankingTeamDiverge = teams.sort((a, b) => b['diverge'] - a['diverge']);
        const rankConverge = rankingTeamConverge.findIndex(x => x.student.id === application.student.id) + 1;
        const rankDiverge = rankingTeamDiverge.findIndex(x => x.student.id === application.student.id) + 1;
        application._student['teamConverge'] = `${rankConverge}º`;
        application._student['teamDiverge'] = `${rankDiverge}º`;
      }

      if (!applications.length) this._util.message('Nenhuma aplicação encontrada!', 'warn');
      else this.result = {assessment, applications};

      this.loading = false;
    } else this._util.message('Verifique os dados antes de buscar!', 'warn');
  }
}
