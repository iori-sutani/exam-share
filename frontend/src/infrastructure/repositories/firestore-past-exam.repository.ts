import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, orderBy, limit } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  getRecentExams(): Observable<PastExam[]> {
    const colRef = collection(this.firestore, 'posts');
    // Example: Order by createdAt desc, limit 20
    // Note: Requires an index in Firestore if filtering/sorting complexly.
    // For now, just getting the collection as is or simple sort if possible.
    // Let's assume we want them sorted by createdAt.
    // If 'createdAt' is stored as a Timestamp, we might need to convert it.
    // collectionData returns the raw data.
    
    const q = query(colRef, orderBy('createdAt', 'desc'), limit(50));
    
    return collectionData(q, { idField: 'id' }).pipe(
      map(docs => docs.map(doc => {
        // Firestore Timestamp to Date conversion if needed
        const data = doc as any;
        return {
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
        } as PastExam;
      }))
    );
  }
}
