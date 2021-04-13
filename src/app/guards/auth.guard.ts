import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate, Router } from '@angular/router';

import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/firebase/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private _user: UserService,
    private auth: AngularFireAuth,
    private _storage: StorageService,
  ){ }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise(resolve => {
      this.auth.onAuthStateChanged(async fbUser => {
        if (fbUser) {
          const user = await this._user.getById(fbUser.uid);
          if (user) {
            this._storage.setUser(user);
            resolve(true);
          } else this.auth.signOut();
        } else {
          this.router.navigateByUrl('/auth/entrar');
          this._storage.removeUser();
          resolve(false);
        }
      });
    });
  }
}
