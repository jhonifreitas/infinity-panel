import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

import { User } from 'src/app/models/user';
import { FirebaseAbstract } from './abstract';

@Injectable({
  providedIn: 'root'
})
export class UserService extends FirebaseAbstract<User> {

  static collectionName = 'users';

  constructor(
    protected db: AngularFirestore,
    private afStorage: AngularFireStorage
  ) {
    super(db, UserService.collectionName);
  }

  private getUrlStorage(fileName: string): string {
    const path = this.collectionPath.replace('/projects/', '');
    return `${path}/${fileName}`;
  }

  uploadImage(id: string, file: Blob | File): Promise<string> {
    return new Promise(resolve => {
      const url = this.getUrlStorage(`${id}.png`);
      this.afStorage.ref(url).put(file).then(async (res) => {
        resolve(await res.ref.getDownloadURL());
      });
    });
  }

  deleteImage(id: string): Promise<boolean> {
    return new Promise(resolve => {
      const url = this.getUrlStorage(`${id}.png`);
      this.afStorage.ref(url).delete().subscribe(async _ => {
        await this.update(id, {avatar: null});
        resolve(true);
      });
    });
  }
}
