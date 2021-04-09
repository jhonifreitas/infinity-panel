import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { UtilService } from 'src/app/services/util.service';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from 'src/app/services/firebase/auth.service';

@Component({
  selector: 'app-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginFormComponent implements OnInit {

  hide = true;
  loading = false;
  form: FormGroup;

  constructor(
    private router: Router,
    private _util: UtilService,
    private _auth: AuthService,
    private formGroup: FormBuilder,
    private _storage: StorageService,
  ) {
    this.form = this.formGroup.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void { }

  async auth(): Promise<void> {
    if (this.form.valid) {
      this.loading = true;
      const data = this.form.value;
      await this._auth.signIn(data.email, data.password).then(res => {
        this._storage.setUser(res);
        this.router.navigateByUrl('/');
      }).catch(err => {
        this._util.message('E-mail ou senha inválido!', 'warn');
      });
      this.loading = false;
    } else {
      this._util.message('Verifique os dados antes de salvar!', 'warn');
    }
  }
}
