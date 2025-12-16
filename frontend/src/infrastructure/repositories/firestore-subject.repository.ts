import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Subject } from '../../core/models/subject';
import { SubjectRepository } from '../../core/ports/subject-repository';

@Injectable({ providedIn: 'root' })
export class FirestoreSubjectRepository implements SubjectRepository {
  constructor(private firestore: Firestore) {}

  findAll(): Observable<Subject[]> {
    const colRef = collection(this.firestore, 'subjects');
    return collectionData(colRef, { idField: 'id' }) as Observable<Subject[]>;
  }
}
