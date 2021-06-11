import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Application } from 'src/app/models/application';
import { FirebaseAbstract, FirebaseWhere } from './abstract';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService extends FirebaseAbstract<Application> {

  static collectionName = 'applications';

  constructor(
    protected db: AngularFirestore
  ) {
    super(db, ApplicationService.collectionName);
  }

  async getByAssementId(assessmentId: string) {
    return this.getWhere('assessment.id', '==', assessmentId);
  }

  async getByAssementIdByStudentId(assessmentId: string, studentId: string) {
    const where = [
      new FirebaseWhere('end', '!=', null),
      new FirebaseWhere('student.id', '==', studentId),
      new FirebaseWhere('assessment.id', '==', assessmentId),
    ];
    return this.getWhereMany(where);
  }
}
