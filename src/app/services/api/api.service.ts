import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private host = environment.hostApi;

  constructor(
    private http: HttpClient,
    private auth: AngularFireAuth,
  ) { }

  async get(endpoint: String, params?: any, reqOpts?: any): Promise<any> {
    if (!reqOpts) {
      reqOpts = {
        headers: await this.getHeaders(),
        params: new HttpParams()
      }
    }

    if (params) {
      reqOpts.params = new HttpParams()
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k])
      }
    }

    return new Promise((resolve, reject) => {
      this.http.get(`${this.host}/${endpoint}`, reqOpts)
        .subscribe(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
    })
  }

  async post(endpoint: String, data: Object, reqOpts?: any): Promise<any> {
    if (!reqOpts) {
      reqOpts = {
        headers: await this.getHeaders()
      }
    }
    return new Promise((resolve, reject) => {
      this.http.post(`${this.host}/${endpoint}`, data, reqOpts)
        .subscribe(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
    })
  }

  async put(endpoint: String, data: Object, reqOpts?: any): Promise<any> {
    if (!reqOpts) {
      reqOpts = {
        headers: await this.getHeaders()
      }
    }

    return new Promise((resolve, reject) => {
      this.http.put(`${this.host}/${endpoint}`, data, reqOpts)
        .subscribe(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
    })
  }

  async patch(endpoint: String, data: Object, reqOpts?: any): Promise<any> {
    if (!reqOpts) {
      reqOpts = {
        headers: await this.getHeaders()
      }
    }

    return new Promise((resolve, reject) => {
      this.http.patch(`${this.host}/${endpoint}`, data, reqOpts)
        .subscribe(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
    })
  }

  async delete(endpoint: String, data?: Object, reqOpts?: any): Promise<any> {
    if (!reqOpts) {
      reqOpts = {
        headers: await this.getHeaders(),
      }
    }
    if(data) reqOpts.body = data;

    return new Promise((resolve, reject) => {
      this.http.delete(`${this.host}/${endpoint}`, reqOpts)
        .subscribe(res => {
          resolve(res)
        }, err => {
          reject(err)
        })
    })
  }

  private async getHeaders(){
    let httpHeaders = new HttpHeaders();
    const user = await this.auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      httpHeaders = httpHeaders.append('Authorization', `Bearer ${token}`)
    }
    return httpHeaders
  }
}
