import { Observable } from 'rxjs';
import { PastExam } from '../core/models/past-exam';
import { PastExamRepository } from '../core/ports/past-exam-repository';

export class GetRecentPastExamsUseCase {
  constructor(private repo: PastExamRepository) {}

  execute(): Observable<PastExam[]> {
    return this.repo.getRecentExams();
  }
}
