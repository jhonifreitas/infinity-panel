export class Permission {
  page: Page;
  role: PageRole;

  // PAGE
  get getPages() {
    const list: {id: string; name: string}[] = [];
    for (const role of Object.entries(Page))
      list.push({id: role[0], name: this.getPage(role[1])});
    return list;
  }

  getPage(role: Page): string {
    switch (role) {
      case Page.UserPage:
        return 'Usuário';
      case Page.GroupPage:
        return 'Grupo';
    }
  }

  // PAGE ROLE
  get getPageRoles() {
    const list: {id: string; name: string}[] = [];
    for (const role of Object.entries(PageRole))
      list.push({id: role[0], name: this.getPageRole(role[1])});
    return list;
  }

  getPageRole(role: PageRole): string {
    switch (role) {
      case PageRole.CanAdd:
        return 'Permite adicionar';
      case PageRole.CanUpdate:
        return 'Permite editar';
      case PageRole.CanDelete:
        return 'Permite deletar';
      case PageRole.CanList:
        return 'Permite listar';
      case PageRole.CanView:
        return 'Permite visualizar';
    }
  }
}

export enum Page {
  UserPage = 'user-page',
  GroupPage = 'group-page',
  CounponPage = 'coupon-page',
  AssessmentPage = 'assessment-page'
}

export enum PageRole {
  CanList = 'can-list',
  CanView = 'can-view',
  CanAdd = 'can-add',
  CanUpdate = 'can-update',
  CanDelete = 'can-delete'
}
