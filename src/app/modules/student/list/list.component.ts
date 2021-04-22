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
  displayedColumns: string[] = ['name', 'email', 'active', 'image', 'actions'];

  canAdd = this._permission.check(Page.StudentPage, PageRole.CanAdd);
  canView = this._permission.check(Page.StudentPage, PageRole.CanView);
  canUpdate = this._permission.check(Page.StudentPage, PageRole.CanUpdate);
  canDelete = this._permission.check(Page.StudentPage, PageRole.CanDelete);

  constructor(
    private _util: UtilService,
    private _student: StudentService,
    public _permission: PermissionService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    const items = await this._student.getAllActive();
    this.dataSource = new MatTableDataSource<Student>(items);
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
    await this._student.delete(object.id);
    this._util.message('Aluno excluído com sucesso!', 'success');
    this.ngOnInit();
  }

  confirmDelete(object: Student): void {
    this._util.delete().then(async _ => {
      this.delete(object);
    }).catch(_ => {});
  }
}