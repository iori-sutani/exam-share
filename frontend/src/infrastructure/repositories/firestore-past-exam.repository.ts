import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { PastExam } from '../../core/models/past-exam';
import { PastExamRepository } from '../../core/ports/past-exam-repository';

@Injectable({ providedIn: 'root' })
export class FirestorePastExamRepository implements PastExamRepository {
  constructor(private firestore: Firestore) {}

  async create(exam: PastExam): Promise<string> {
    const colRef = collection(this.firestore, 'posts');
    const docRef = await addDoc(colRef, exam);
    return docRef.id;
  }
}
