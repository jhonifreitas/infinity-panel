import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { Page, PageRole } from 'src/app/models/permission';
import { StorageService } from 'src/app/services/storage.service';
import { PermissionService } from 'src/app/services/permission.service';

interface MenuItem {
  title: string;
  url?: string;
  icon: string;
  hidden: boolean;
  permission?: {
    page: Page;
    role: PageRole;
  };
  subItems?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  menuItems: MenuItem[] = [
    { title: 'Assessment', icon: 'assessment', hidden: false, subItems: [
      { title: 'Listagem', url: '/assessments', icon: 'list', hidden: false, permission: {
        page: Page.AssessmentPage, role: PageRole.CanList}
      },
      { title: 'Questões', url: '/assessment/questoes', icon: 'quiz', hidden: false, permission: {
        page: Page.AssessmentQuestionPage, role: PageRole.CanList}
      },
      { title: 'Grupos', url: '/assessment/grupos', icon: 'groups', hidden: false, permission: {
        page: Page.AssessmentGroupPage, role: PageRole.CanList}
      },
      { title: 'Instruções', url: '/assessment/instrucoes', icon: 'feedback', hidden: false, permission: {
        page: Page.AssessmentInstructionPage, role: PageRole.CanList}
      },
      { title: 'Resultados', url: '/assessment/resultados', icon: 'gavel', hidden: false, permission: {
        page: Page.AssessmentResultPage, role: PageRole.CanList}
      },
    ]},
    { title: 'Alunos', url: '/alunos', icon: 'person', hidden: false, permission: {
      page: Page.UserPage, role: PageRole.CanList}
    },
    { title: 'Empresas', url: '/empresas', icon: 'work', hidden: false, permission: {
      page: Page.CompanyPage, role: PageRole.CanList}
    },
    // { title: 'Cupons', url: '/cupons', icon: 'local_offer', hidden: false, permission: {
    //   page: Page.CounponPage, role: PageRole.CanList}
    // },
    { title: 'Acessos ao conteúdo', url: '/acessos', icon: 'vpn_key', hidden: false, permission: {
      page: Page.AccessPage, role: PageRole.CanList}
    },
    { title: 'Autorização', icon: 'verified_user', hidden: false, subItems: [
      { title: 'Usuários', url: '/administracao/usuarios', icon: 'person', hidden: false, permission: {
        page: Page.UserPage, role: PageRole.CanList}
      },
      { title: 'Grupos', url: '/administracao/grupos', icon: 'group', hidden: false, permission: {
        page: Page.GroupPage, role: PageRole.CanList}
      },
    ]},
  ];

  constructor(
    public _storage: StorageService,
    private _permission: PermissionService
  ) { }

  ngOnInit(): void {
    const interval = setInterval(() => {
      if (this._storage.getUser) {
        clearInterval(interval);
        for (const item of this.menuItems) {
          item.hidden = !this.hasPermission(item);
          if (item.subItems) for (const subItem of item.subItems) subItem.hidden = !this.hasPermission(subItem);
        }
      }
    }, 500);
  }

  closeSideBar(): void {
    const width = window.innerWidth;
    if (width <= 960 && !this.toggleSideBarForMe.closed) {
      this.toggleSideBarForMe.emit();
      setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
    }
  }

  hasPermission(item: MenuItem): boolean {
    if (item.subItems) {
      for (const subItem of item.subItems)
        if (this._permission.check(subItem.permission.page, subItem.permission.role)) return true;
      return false;
    } else return this._permission.check(item.permission.page, item.permission.role);
  }
}
