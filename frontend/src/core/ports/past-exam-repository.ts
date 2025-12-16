import { PastExam } from '../models/past-exam';

export abstract class PastExamRepository {
  /**
   * Create a past exam entry and return the created document id.
   */
  abstract create(exam: PastExam): Promise<string>;

  // future: list/get/update/delete
}
