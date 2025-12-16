import { PastExam } from '../models/past-exam';
import { Observable } from 'rxjs';

export abstract class PastExamRepository {
  /**
   * Create a past exam entry and return the created document id.
   */
  abstract create(exam: PastExam): Promise<string>;

  /**
   * Get recent past exams.
   */
  abstract getRecentExams(): Observable<PastExam[]>;
}
