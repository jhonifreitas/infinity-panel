import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Question } from 'src/app/models/assessment';
import { Page, PageRole } from 'src/app/models/permission';

import { AssessmentQuestionFormComponent } from '../form/form.component';
import { AssessmentQuestionDetailComponent } from '../detail/detail.component';

import { UtilService } from 'src/app/services/util.service';
import { PermissionService } from 'src/app/services/permission.service';
import { AssessmentQuestionService } from 'src/app/services/firebase/assessment/question.service';

@Component({
  selector: 'app-assessment-question-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class AssessmentQuestionListComponent implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  filter: string;
  loading = true;
  dataSource: MatTableDataSource<Question>;
  displayedColumns: string[] = ['title', 'actions'];

  canAdd = this._permission.check(Page.GroupPage, PageRole.CanAdd);
  canView = this._permission.check(Page.GroupPage, PageRole.CanView);
  canUpdate = this._permission.check(Page.GroupPage, PageRole.CanUpdate);
  canDelete = this._permission.check(Page.GroupPage, PageRole.CanDelete);

  constructor(
    private _util: UtilService,
    private _permission: PermissionService,
    private _question: AssessmentQuestionService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    const items = await this._question.getAll();
    this.dataSource = new MatTableDataSource<Question>(items);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.loading = false;
  }

  applyFilter(): void {
    this.dataSource.filter = this.filter.trim().toLowerCase();
  }

  openDetail(object?: Question): void {
    if (this.canView) this._util.detail(AssessmentQuestionDetailComponent, object);
  }

  openForm(object?: Question): void {
    this._util.form(AssessmentQuestionFormComponent, object).then(res => {
      if (res) this.ngOnInit();
    });
  }

  async delete(object: Question): Promise<void> {
    await this._question.delete(object.id).then(_ => {
      this.ngOnInit();
      this._util.message('Instrução excluída com sucesso!', 'success');
    });
  }

  confirmDelete(object: Question): void {
    this._util.delete().then(async _ => {
      this.delete(object);
    }).catch(_ => {});
  }
}
