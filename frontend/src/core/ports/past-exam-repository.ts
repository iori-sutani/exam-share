import { PastExam } from '../models/past-exam';

export interface PastExamRepository {
  /**
   * Create a past exam entry and return the created document id.
   */
  create(exam: PastExam): Promise<string>;

  // future: list/get/update/delete
}
