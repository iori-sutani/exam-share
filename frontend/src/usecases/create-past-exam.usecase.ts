import { PastExam, NewPastExam } from '../core/models/past-exam';
import { PastExamRepository } from '../core/ports/past-exam-repository';
import { EmailValidator } from '../core/ports/email-validator';

/**
 * Use case that encapsulates business rules for creating a PastExam.
 *
 * Responsibilities:
 * - Validate required/length rules for fields
 * - Verify email via EmailValidator port
 * - Normalize/complete the PastExam object and delegate persistence to PastExamRepository
 */
export class CreatePastExamUseCase {
  constructor(private repo: PastExamRepository, private emailValidator: EmailValidator) {}

  async execute(input: NewPastExam): Promise<string> {
    // Basic validation rules
    const subject = (input.subject ?? '').trim();
    if (!subject) throw new Error('科目名を入力してください');
    if (subject.length > 100) throw new Error('科目名は100文字以内で入力してください');

    const current = new Date().getFullYear();
    if (typeof input.year !== 'number' || input.year < current - 8 || input.year > current) {
      throw new Error('適切な年度を入力してください');
    }

    if (!['spring', 'fall'].includes(input.term)) throw new Error("前期/後期を選択してください");

    if (input.memo && input.memo.length > 500) throw new Error('メモは500文字以内で入力してください');

    if (!input.email) throw new Error('大学のメールアドレスを入力してください');

    const isEmailOk = await this.emailValidator.validate(input.email);
    if (!isEmailOk) throw new Error('大学のメールアドレスが正しくありません');

    const exam: PastExam = {
      subject,
      term: input.term,
      year: input.year,
      memo: input.memo ?? '',
      photo: input.photo,
      email: input.email,
      createdAt: input.createdAt ?? new Date(),
    };

    return this.repo.create(exam);
  }
}
