import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';

import { Student } from 'src/app/models/student';
import { Page, PageRole } from 'src/app/models/permission';

import { StudentFormComponent } from '../form/form.component';
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
  displayedColumns: string[] = ['name', 'email', 'active', 'avatar', 'actions'];

  canAdd = this._permission.check(Page.GroupPage, PageRole.CanAdd);
  canView = this._permission.check(Page.GroupPage, PageRole.CanView);
  canUpdate = this._permission.check(Page.GroupPage, PageRole.CanUpdate);
  canDelete = this._permission.check(Page.GroupPage, PageRole.CanDelete);

  constructor(
    private _util: UtilService,
    private _student: StudentService,
    public _permission: PermissionService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    const students = await this._student.getAll();
    this.dataSource = new MatTableDataSource<Student>(students);
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

  openForm(object?: Student): void {
    this._util.form(StudentFormComponent, object).then(res => {
      if (res) this.ngOnInit();
    });
  }

  async deleteImage(id: string): Promise<void> {
    await this._student.deleteImage(id);
  }

  async delete(object: Student): Promise<void> {
    await this._student.delete(object.id);
    if (object.avatar) await this.deleteImage(object.id);
    this._util.message('Aluno excluído com sucesso!', 'success');
  }

  confirmDelete(object: Student): void {
    this._util.delete().then(async _ => {
      this.delete(object);
    }).catch(_ => {});
  }
}
