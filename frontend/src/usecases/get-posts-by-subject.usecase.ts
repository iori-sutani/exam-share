import { Observable } from 'rxjs';
import { PastExam } from '../core/models/past-exam';
import { PastExamRepository } from '../core/ports/past-exam-repository';

export class GetPostsBySubjectUseCase {
  constructor(private repo: PastExamRepository) {}

  execute(subjectId: string): Observable<PastExam[]> {
    return this.repo.findBySubject(subjectId);
  }
}
