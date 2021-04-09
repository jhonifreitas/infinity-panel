export class Permission {
  page: Page;
  role: PageRole;
}

export enum Page {
  UserPage = 'user-page',
  GroupPage = 'group-page'
}

export enum PageRole {
  CanAdd = 'can-add',
  CanList = 'can-list',
  CanView = 'can-view',
  CanUpdate = 'can-update',
  CanDelete = 'can-delete'
}
