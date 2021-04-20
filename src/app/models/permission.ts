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
      case Page.CounponPage:
        return 'Cupom';
      case Page.StudentPage:
        return 'Aluno';
      case Page.AssessmentQuestionPage:
        return 'Assement Questão';
      case Page.AssessmentInstructionPage:
        return 'Assement Instrução';
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
  StudentPage = 'student-page',
  AssessmentQuestionPage = 'assessment-question-page',
  AssessmentInstructionPage = 'assessment-instruction-page'
}

export enum PageRole {
  CanList = 'can-list',
  CanView = 'can-view',
  CanAdd = 'can-add',
  CanUpdate = 'can-update',
  CanDelete = 'can-delete'
}
