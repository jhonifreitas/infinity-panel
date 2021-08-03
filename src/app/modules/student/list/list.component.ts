import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Student } from 'src/app/models/student';
import { Page, PageRole } from 'src/app/models/permission';

import { StudentDetailComponent } from '../detail/detail.component';

import { UtilService } from 'src/app/services/util.service';
import { PermissionService } from 'src/app/services/permission.service';
import { StudentService } from 'src/app/services/firebase/student.service';
import { CompanyService } from 'src/app/services/firebase/company/company.service';
import { CompanyAreaService } from 'src/app/services/firebase/company/area.service';
import { CompanyPostService } from 'src/app/services/firebase/company/post.service';
import { CompanyBranchService } from 'src/app/services/firebase/company/branch.service';
import { CompanyDepartmentService } from 'src/app/services/firebase/company/department.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class StudentListComponent implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  filter: string;
  loading = true;
  dataSource: MatTableDataSource<Student>;
  displayedColumns: string[] = [
    'name', 'email', 'company._department.name', 'company._area.name', 'company._post.name', 'deletedAt', 'image', 'actions'];

  canAdd = this._permission.check(Page.StudentPage, PageRole.CanAdd);
  canView = this._permission.check(Page.StudentPage, PageRole.CanView);
  canUpdate = this._permission.check(Page.StudentPage, PageRole.CanUpdate);
  canDelete = this._permission.check(Page.StudentPage, PageRole.CanDelete);

  constructor(
    private _util: UtilService,
    private _student: StudentService,
    private _company: CompanyService,
    private _area: CompanyAreaService,
    private _post: CompanyPostService,
    public _permission: PermissionService,
    private _branch: CompanyBranchService,
    private _department: CompanyDepartmentService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    const items = await this._student.getAll();
    this.dataSource = new MatTableDataSource<Student>(items);
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'company._area.name': return item.company?._area?.name;
        case 'company._post.name': return item.company?._post?.name;
        case 'company._branch.name': return item.company?._branch?.name;
        case 'company._company.name': return item.company?._company?.name;
        case 'company._department.name': return item.company?._department?.name;
        default: return item[property];
      }
    };
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.loading = false;
  }

  applyFilter(): void {
    this.dataSource.filter = this.filter.trim().toLowerCase();
  }

  openDetail(object?: Student): void {
    if (this.canView) this._util.detail(StudentDetailComponent, object);
  }

  async delete(object: Student): Promise<void> {
    if (object.image) await this._student.deleteImage(object.id);
    await this._student.softDelete(object.id, !object.deletedAt);
    this._util.message(`Aluno ${object.deletedAt ? 'ativado' : 'desativado'} com sucesso!`, 'success');
    this.ngOnInit();
  }

  confirmDelete(object: Student): void {
    this._util.delete(object.deletedAt ? 'enable' : 'disable').then(async _ => {
      this.delete(object);
    }).catch(_ => {});
  }
}
