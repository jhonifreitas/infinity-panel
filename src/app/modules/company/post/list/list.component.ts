import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Post } from 'src/app/models/company';
import { Page, PageRole } from 'src/app/models/permission';

import { CompanyPostFormComponent } from '../form/form.component';
import { CompanyPostDetailComponent } from '../detail/detail.component';

import { UtilService } from 'src/app/services/util.service';
import { PermissionService } from 'src/app/services/permission.service';
import { CompanyPostService } from 'src/app/services/firebase/company/post.service';
import { CompanyDepartmentService } from 'src/app/services/firebase/company/department.service';

@Component({
  selector: 'app-company-post-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class CompanyPostListComponent implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  filter: string;
  loading = true;
  dataSource: MatTableDataSource<Post>;
  displayedColumns: string[] = ['name', '_department', 'level', 'actions'];

  canAdd = this._permission.check(Page.CompanyPage, PageRole.CanAdd);
  canView = this._permission.check(Page.CompanyPage, PageRole.CanView);
  canUpdate = this._permission.check(Page.CompanyPage, PageRole.CanUpdate);
  canDelete = this._permission.check(Page.CompanyPage, PageRole.CanDelete);

  constructor(
    private _util: UtilService,
    private _post: CompanyPostService,
    private _permission: PermissionService,
    private _department: CompanyDepartmentService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    const items = await this._post.getAllActive();
    for (const item of items) item._department = await this._department.getById(item.departmentId);
    this.dataSource = new MatTableDataSource<Post>(items);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.loading = false;
  }

  applyFilter(): void {
    this.dataSource.filter = this.filter.trim().toLowerCase();
  }

  openDetail(object?: Post): void {
    if (this.canView) this._util.detail(CompanyPostDetailComponent, object);
  }

  openForm(object?: Post): void {
    this._util.form(CompanyPostFormComponent, object).then(res => {
      if (res) this.ngOnInit();
    });
  }

  async delete(object: Post): Promise<void> {
    await this._post.delete(object.id);
    this._util.message('Cargo excluído com sucesso!', 'success');
    this.ngOnInit();
  }

  confirmDelete(object: Post): void {
    this._util.delete().then(async _ => {
      this.delete(object);
    }).catch(_ => {});
  }
}
