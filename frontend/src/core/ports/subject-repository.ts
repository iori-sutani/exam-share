import { Observable } from 'rxjs';
import { Subject } from '../models/subject';

export abstract class SubjectRepository {
  abstract findAll(): Observable<Subject[]>;
}
