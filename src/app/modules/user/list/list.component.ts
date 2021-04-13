import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Component, OnInit, ViewChild } from '@angular/core';

import { User } from 'src/app/models/user';
import { Page, PageRole } from 'src/app/models/permission';

import { UserFormComponent } from '../form/form.component';
import { UserDetailComponent } from '../detail/detail.component';

import { UtilService } from 'src/app/services/util.service';
import { UserService } from 'src/app/services/firebase/user.service';
import { PermissionService } from 'src/app/services/permission.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class UserListComponent implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  filter: string;
  loading = true;
  dataSource: MatTableDataSource<User>;
  displayedColumns: string[] = ['name', 'email', 'superUser', 'active', 'avatar', 'actions'];

  canAdd = this._permission.check(Page.GroupPage, PageRole.CanAdd);
  canView = this._permission.check(Page.GroupPage, PageRole.CanView);
  canUpdate = this._permission.check(Page.GroupPage, PageRole.CanUpdate);
  canDelete = this._permission.check(Page.GroupPage, PageRole.CanDelete);

  constructor(
    private _util: UtilService,
    private _user: UserService,
    public _permission: PermissionService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.loading = true;
    const users = await this._user.getAll();
    this.dataSource = new MatTableDataSource<User>(users);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.loading = false;
  }

  applyFilter(): void {
    this.dataSource.filter = this.filter.trim().toLowerCase();
  }

  openDetail(object?: User): void {
    if (this.canView) this._util.detail(UserDetailComponent, object);
  }

  openForm(object?: User): void {
    this._util.form(UserFormComponent, object).then(res => {
      if (res) this.ngOnInit();
    });
  }

  async deleteImage(id: string): Promise<void> {
    await this._user.deleteImage(id);
  }

  async delete(object: User): Promise<void> {
    await this._user.delete(object.id);
    if (object.avatar) await this.deleteImage(object.id);
    this._util.message('Usuário excluído com sucesso!', 'success');
  }

  confirmDelete(object: User): void {
    this._util.delete().then(async _ => {
      this.delete(object);
    }).catch(_ => {});
  }
}