import { Observable } from 'rxjs';
import { Subject } from '../core/models/subject';
import { SubjectRepository } from '../core/ports/subject-repository';

export class GetAllSubjectsUseCase {
  constructor(private repo: SubjectRepository) {}

  execute(): Observable<Subject[]> {
    return this.repo.findAll();
  }
}
