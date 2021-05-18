import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { StorageService } from '../storage.service';
import { Application } from 'src/app/models/application';
import { FirebaseAbstract, FirebaseWhere } from './abstract';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService extends FirebaseAbstract<Application> {

  static collectionName = 'applications';

  constructor(
    protected db: AngularFirestore,
    private _storage: StorageService
  ) {
    super(db, ApplicationService.collectionName);
  }

  async getByAssementIdByRangeDate(assessmentId: string, rangeDate: {start: Date; end: Date}) {
    const where = [
      new FirebaseWhere('assessment.id', '==', assessmentId),
      new FirebaseWhere('init', '>', rangeDate.start),
      new FirebaseWhere('init', '<=', rangeDate.end),
    ];
    return this.getWhereMany(where);
  }
}
