import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, orderBy, limit, doc, setDoc, collectionGroup } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PastExam } from '../../core/models/past-exam';
import { PastExamRepository } from '../../core/ports/past-exam-repository';

@Injectable({ providedIn: 'root' })
export class FirestorePastExamRepository implements PastExamRepository {
  constructor(private firestore: Firestore) {}

  async create(exam: PastExam): Promise<string> {
    // Sanitize subject name to create a safe document ID for the folder
    // Replace slashes and other special chars with underscore
    const subjectId = exam.subject.trim().replace(/[\/\\\?%*:|"<>]/g, '_');

    // Ensure the subject "folder" (document) exists
    const subjectDocRef = doc(this.firestore, 'subjects', subjectId);
    await setDoc(subjectDocRef, { name: exam.subject }, { merge: true });

    // Add the post to the 'posts' subcollection of the subject
    const postsColRef = collection(this.firestore, 'subjects', subjectId, 'posts');
    const docRef = await addDoc(postsColRef, exam);

    return docRef.id;
  }

  getRecentExams(): Observable<PastExam[]> {
    // Use collectionGroup to query all 'posts' collections across all subjects
    const postsQuery = query(
      collectionGroup(this.firestore, 'posts'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    return collectionData(postsQuery, { idField: 'id' }).pipe(
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

  findBySubject(subjectId: string): Observable<PastExam[]> {
    const postsColRef = collection(this.firestore, 'subjects', subjectId, 'posts');
    const q = query(postsColRef, orderBy('createdAt', 'desc'));

    return collectionData(q, { idField: 'id' }).pipe(
      map(docs => docs.map(doc => {
        const data = doc as any;
        return {
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
        } as PastExam;
      }))
    );
  }
}
